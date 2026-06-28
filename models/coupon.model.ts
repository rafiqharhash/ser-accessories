import mongoose, { Schema } from "mongoose";
import { ICoupon } from "@/types/models/coupon.types";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    minimumPurchase: { type: Number, default: 0 },
    expirationDate: Date,
    maxUsage: Number,
    currentUsage: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ active: 1, expirationDate: 1 });

export const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);
