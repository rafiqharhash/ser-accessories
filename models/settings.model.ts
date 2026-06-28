import mongoose, { Schema } from "mongoose";
import { ISettings } from "@/types/models/settings.types";

const mediaSchema = new Schema({
  publicId: { type: String, required: true },
  secureUrl: { type: String, required: true },
  width: Number,
  height: Number,
  format: String,
  bytes: Number,
  altText: String,
  displayOrder: { type: Number, default: 0 },
});

const settingsSchema = new Schema<ISettings>(
  {
    instapayNumber: String,
    vodafoneCashNumber: String,
    announcementBanner: String,
    maintenanceMode: { type: Boolean, default: false },
    websiteName: { type: String, default: "SER | سِر" },
    logo: mediaSchema,
    favicon: mediaSchema,
    heroImages: [mediaSchema],
    contactEmail: String,
    contactPhone: String,
    address: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      tiktok: String,
      twitter: String,
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      defaultOpenGraphImage: mediaSchema,
    },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);
