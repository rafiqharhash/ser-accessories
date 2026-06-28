import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    secureUrl: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    altText: String,
    uploadedBy: { type: String, default: "Admin" }, // In a real app with multiple admins, save admin ID
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);
