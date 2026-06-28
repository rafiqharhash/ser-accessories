import { Document, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  type: string;       // e.g. "ORDER_CREATED", "LOW_STOCK", "NEW_REVIEW"
  severity: "info" | "warning" | "critical";
  message: string;
  link?: string;
  readAt?: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}
