import { Document, Types } from "mongoose";

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase?: number;
  expirationDate?: Date;
  maxUsage?: number;
  currentUsage: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
