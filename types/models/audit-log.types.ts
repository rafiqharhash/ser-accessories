import { Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  admin: Types.ObjectId;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
