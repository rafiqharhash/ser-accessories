"use server";

import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/review.model";
import { Product } from "@/models/product.model";
import { AuditLog } from "@/models/audit-log.model";
import { NotificationService } from "@/services/notification.service";
import { revalidatePath } from "next/cache";

export async function getAdminReviews() {
  await connectToDatabase();
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'name slug images' })
    .sort({ createdAt: -1 })
    .lean();
  
  return JSON.parse(JSON.stringify(reviews));
}

export async function updateReviewStatus(id: string, approved: boolean, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Review.findByIdAndUpdate(id, { approved });
    await AuditLog.create({ 
      admin: adminId, 
      action: "UPDATE_REVIEW_STATUS", 
      resource: "Review", 
      resourceId: id,
      details: { approved } 
    });
    
    // We should revalidate the specific product page, but we'd need the product ID. 
    // Revalidating the whole shop is safest here.
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to update review status" };
  }
}

export async function deleteReview(id: string, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Review.findByIdAndDelete(id);
    await AuditLog.create({ admin: adminId, action: "DELETE_REVIEW", resource: "Review", resourceId: id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete review" };
  }
}

export async function getProductReviews(productId: string) {
  await connectToDatabase();
  const reviews = await Review.find({ product: productId, approved: true })
    .sort({ createdAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(reviews));
}

export async function createReview(productId: string, data: { customerName: string; rating: number; review: string }) {
  try {
    await connectToDatabase();
    
    // Validate existence of product
    const product = await Product.findById(productId);
    if (!product) return { success: false, error: "Product not found" };

    // Spam prevention: Check if this name already reviewed this product recently
    const existing = await Review.findOne({
      product: productId,
      customerName: data.customerName
    });

    if (existing) {
      return { success: false, error: "You have already submitted a review for this product." };
    }

    await Review.create({
      product: productId,
      customerName: data.customerName,
      rating: data.rating,
      review: data.review,
      approved: false // Default to pending
    });

    await NotificationService.notifyNewReview(product.name, productId, data.rating);

    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to submit review" };
  }
}
