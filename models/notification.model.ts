import mongoose, { Schema } from "mongoose";
import { INotification } from "@/types/models/notification.types";

const notificationSchema = new Schema<INotification>(
  {
    type: { type: String, required: true, index: true },
    severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
    message: { type: String, required: true },
    link: { type: String },
    readAt: { type: Date },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

// Optimize for polling unread notifications sorted by recency
notificationSchema.index({ readAt: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);
