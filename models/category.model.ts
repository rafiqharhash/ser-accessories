import mongoose, { Schema } from "mongoose";
import { ICategory } from "@/types/models/category.types";

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

const categorySchema = new Schema<ICategory>(
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

categorySchema.index({ slug: 1 });
categorySchema.index({ active: 1, sortOrder: 1 });

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
