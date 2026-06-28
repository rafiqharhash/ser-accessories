"use server";

import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";

export async function getOrderTrackingDetails(orderNumber: string) {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ orderNumber }).lean();
    
    if (!order) {
      return { success: false, error: "Order not found. Please check your order number." };
    }

    // Convert ObjectIds to strings for serialization
    const safeOrder = JSON.parse(JSON.stringify(order));
    
    // We explicitly omit sensitive customer data (like exact phone/address) to prevent enumeration leaks.
    // We only expose tracking details and safe snapshots.
    return { 
      success: true, 
      order: {
        orderNumber: safeOrder.orderNumber,
        orderStatus: safeOrder.orderStatus,
        paymentStatus: safeOrder.paymentStatus,
        createdAt: safeOrder.createdAt,
        city: safeOrder.city,
        governorate: safeOrder.governorate,
        history: safeOrder.history || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products: safeOrder.products.map((p: any) => ({
          nameSnapshot: p.nameSnapshot,
          slugSnapshot: p.slugSnapshot,
          skuSnapshot: p.skuSnapshot,
          selectedColor: p.selectedColor,
          selectedSize: p.selectedSize,
          quantity: p.quantity,
          featuredImageSnapshot: p.featuredImageSnapshot,
        })),
        total: safeOrder.total,
        shippingCost: safeOrder.shippingCost,
      } 
    };
  } catch (error) {
    console.error("Error fetching order tracking:", error);
    return { success: false, error: "Failed to retrieve order." };
  }
}
