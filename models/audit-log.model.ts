import mongoose, { Schema } from "mongoose";
import { IAuditLog } from "@/types/models/audit-log.types";

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: String,
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    ipAddress: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ admin: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
