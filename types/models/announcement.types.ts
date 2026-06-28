import { Document, Types } from "mongoose";

export interface IAnnouncement extends Document {
  _id: Types.ObjectId;
  title: string;
  message: string;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
