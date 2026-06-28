import mongoose, { Schema } from "mongoose";
import { IAnnouncement } from "@/types/models/announcement.types";

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    active: { type: Boolean, default: true },
    link: { type: String },
    backgroundColor: { type: String, default: "#000000" },
    textColor: { type: String, default: "#ffffff" },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", announcementSchema);
