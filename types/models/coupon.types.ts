import { Document, Types } from "mongoose";

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  percentage: number;
  minimumPurchase?: number;
  expirationDate?: Date;
  maxUsage?: number;
  currentUsage: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
