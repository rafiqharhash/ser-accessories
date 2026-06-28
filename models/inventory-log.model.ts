import mongoose, { Schema } from "mongoose";
import { IInventoryLog } from "@/types/models/inventory-log.types";

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ product: 1, createdAt: -1 });

export const InventoryLog = mongoose.models.InventoryLog || mongoose.model<IInventoryLog>("InventoryLog", inventoryLogSchema);
