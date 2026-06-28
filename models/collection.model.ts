import mongoose, { Schema } from "mongoose";
import { ICollection } from "@/types/models/collection.types";

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

const collectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: mediaSchema,
    description: { type: String },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

collectionSchema.index({ slug: 1 });
collectionSchema.index({ active: 1, sortOrder: 1 });

export const Collection = mongoose.models.Collection || mongoose.model<ICollection>("Collection", collectionSchema);
