import { InventoryLog } from "@/models/inventory-log.model";
import { Types } from "mongoose";

export class InventoryLogRepository {
  static async createLog(data: {
    product: string | Types.ObjectId;
    variant?: string | Types.ObjectId;
    previousStock: number;
    newStock: number;
    reason: string;
    admin: string | Types.ObjectId;
  }) {
    const log = new InventoryLog(data);
    return log.save();
  }
}
