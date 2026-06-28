import { Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  customerName: string;
  rating: number;
  review: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
