import mongoose, { Schema } from "mongoose";
import { IReview } from "@/types/models/review.types";

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, approved: 1 });

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
