import { Document, Types } from "mongoose";

export interface IInventoryLog extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  variant?: Types.ObjectId;
  previousStock: number;
  newStock: number;
  reason: string;
  admin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
