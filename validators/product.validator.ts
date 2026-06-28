import { z } from "zod";
import { mediaSchema } from "./common.validator";

export const productVariantSchema = z.object({
  color: z.string().min(1),
  size: z.string().min(1),
  material: z.string().optional(),
  sku: z.string().min(1),
  stock: z.number().int().min(0),
  active: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
  collectionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Collection ID").optional(),
  brand: z.string().optional(),
  gender: z.enum(["Men", "Women", "Unisex"]).optional(),
  featuredImage: mediaSchema,
  galleryImages: z.array(mediaSchema).default([]),
  productVideo: mediaSchema.optional(),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  SKU: z.string().min(3),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  onSale: z.boolean().default(false),
  stockMode: z.enum(["single", "variant"]).default("single"),
  stock: z.number().int().min(0).default(0),
  variantStock: z.array(productVariantSchema).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type ProductInput = z.infer<typeof productSchema>;
