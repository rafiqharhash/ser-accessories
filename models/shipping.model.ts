import mongoose, { Schema } from "mongoose";
import { IShipping } from "@/types/models/shipping.types";

const shippingSchema = new Schema<IShipping>(
  {
    governorate: { type: String, required: true, unique: true, trim: true },
    shippingPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Shipping = mongoose.models.Shipping || mongoose.model<IShipping>("Shipping", shippingSchema);
