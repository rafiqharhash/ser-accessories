import { Document, Types } from "mongoose";

export interface IShipping extends Document {
  _id: Types.ObjectId;
  governorate: string;
  shippingPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
