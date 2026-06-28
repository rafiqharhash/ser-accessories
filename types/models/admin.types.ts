import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
