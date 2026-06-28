import { Document, Types } from "mongoose";

export interface IAnnouncement extends Document {
  _id: Types.ObjectId;
  title: string;
  message: string;
  active: boolean;
  link?: string;
  backgroundColor: string;
  textColor: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
