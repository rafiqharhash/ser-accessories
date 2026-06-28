"use server";

import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { NotificationService } from "@/services/notification.service";
import { revalidatePath } from "next/cache";

/**
 * Updates Order Status and automatically handles stock modifications.
 */
export async function updateOrderStatus(orderId: string, newStatus: string, adminComment?: string) {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: "Order not found" };

    const oldStatus = order.orderStatus;

    // Handle Stock Restoration if cancelling a previously active order
    if ((newStatus === "cancelled" || newStatus === "returned") && oldStatus !== "cancelled" && oldStatus !== "returned") {
      await restoreOrderStock(order);
    }

    // Handle Stock Deduction if moving from cancelled/returned back to active
    if ((oldStatus === "cancelled" || oldStatus === "returned") && newStatus !== "cancelled" && newStatus !== "returned") {
      await deductOrderStock(order); // Assumes we still have stock. In a real app, this should check limits first.
    }

    order.orderStatus = newStatus;
    order.history.push({
      status: newStatus,
      comment: adminComment || `Status updated from ${oldStatus} to ${newStatus}`,
      timestamp: new Date(),
    });

    await order.save();
    
    // Asynchronously notify customer
    NotificationService.sendStatusUpdate(order, newStatus);
    
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Server error updating status." };
  }
}

/**
 * Verifies or Rejects Payment Screenshot
 */
export async function updatePaymentStatus(orderId: string, newStatus: "verified" | "rejected", adminComment?: string) {
  try {
    await connectToDatabase();
    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: "Order not found" };

    order.paymentStatus = newStatus;
    
    // Automatically confirm order if payment is verified and it's currently pending
    if (newStatus === "verified" && order.orderStatus === "pending") {
      order.orderStatus = "confirmed";
      order.history.push({
        status: "confirmed",
        comment: "Auto-confirmed via Payment Verification",
        timestamp: new Date(),
      });
    }

    order.history.push({
      status: `Payment ${newStatus}`,
      comment: adminComment || `Payment marked as ${newStatus}`,
      timestamp: new Date(),
    });

    await order.save();

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update payment:", error);
    return { success: false, error: "Server error updating payment." };
  }
}

// Helpers for Inventory
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function restoreOrderStock(order: any) {
  for (const item of order.products) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    if (product.stockMode === "single") {
      product.stock += item.quantity;
    } else if (product.stockMode === "variants") {
      // Find specific variant
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variant = product.variants.find((v: any) => v.color === item.selectedColor && v.size === item.selectedSize);
      if (variant) {
        variant.stock += item.quantity;
      }
    }
    await product.save();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deductOrderStock(order: any) {
  for (const item of order.products) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    if (product.stockMode === "single") {
      product.stock = Math.max(0, product.stock - item.quantity);
    } else if (product.stockMode === "variants") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variant = product.variants.find((v: any) => v.color === item.selectedColor && v.size === item.selectedSize);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
    }
    await product.save();
  }
}
