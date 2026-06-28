import mongoose, { Schema } from "mongoose";
import { IProduct } from "@/types/models/product.types";

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

const variantSchema = new Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  material: String,
  sku: { type: String, required: true },
  barcode: String,
  priceOverride: Number,
  salePriceOverride: Number,
  stock: { type: Number, required: true, default: 0 },
  reservedStock: { type: Number, default: 0 },
  availableStock: { type: Number, default: 0 },
  image: mediaSchema,
  active: { type: Boolean, default: true },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    slugHistory: [String],
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    discountPercentage: Number,
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection" },
    brand: String,
    gender: { type: String, enum: ["Men", "Women", "Unisex"] },
    featuredImage: { type: mediaSchema, required: true },
    galleryImages: [mediaSchema],
    productVideo: mediaSchema,
    colors: [String],
    sizes: [String],
    materials: [String],
    SKU: { type: String, required: true, unique: true },
    tags: [String],
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    stockMode: { type: String, enum: ["single", "variant"], default: "single" },
    stock: { type: Number, default: 0 },
    variantStock: [variantSchema],
    seo: {
      title: String,
      description: String,
      canonicalUrl: String,
      openGraphImage: mediaSchema,
    },
    status: { type: String, enum: ["draft", "published", "archived", "scheduled"], default: "draft" },
    scheduledPublishDate: Date,
    version: { type: Number, default: 1 },
    historyLog: [{
      version: Number,
      changedAt: { type: Date, default: Date.now },
      changedBy: String,
      summary: String,
    }],
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// Indexes for fast querying
productSchema.index({ slug: 1 });
productSchema.index({ SKU: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ collectionId: 1, status: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ bestSeller: -1, createdAt: -1 });
productSchema.index({ newArrival: -1, createdAt: -1 });
// Text index for search
productSchema.index({ name: "text", description: "text", "tags": "text" });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
