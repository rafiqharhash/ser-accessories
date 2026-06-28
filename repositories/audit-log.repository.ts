import { AuditLog } from "@/models/audit-log.model";
import { Types } from "mongoose";

export class AuditLogRepository {
  static async createLog(data: {
    action: string;
    entity: string;
    entityId?: string;
    admin: string | Types.ObjectId;
    ipAddress?: string;
  }) {
    const log = new AuditLog(data);
    return log.save();
  }
}
