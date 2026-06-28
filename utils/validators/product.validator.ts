import { z } from "zod";

const mediaSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  altText: z.string().optional(),
});

export const variantValidator = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  material: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  priceOverride: z.number().optional(),
  salePriceOverride: z.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
  active: z.boolean().default(true),
  image: mediaSchema.optional(),
});

export const productValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").trim(),
  slug: z.string().min(3).trim().toLowerCase(),
  description: z.string().min(10, "Description is required"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  oldPrice: z.coerce.number().optional(),
  discountPercentage: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"), // Assuming ObjectId string
  collectionId: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["Men", "Women", "Unisex"]).optional(),
  featuredImage: mediaSchema,
  galleryImages: z.array(mediaSchema).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  SKU: z.string().min(1, "Master SKU is required"),
  tags: z.array(z.string()).optional(),
  stockMode: z.enum(["single", "variant"]),
  stock: z.coerce.number().min(0).default(0),
  variantStock: z.array(variantValidator).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    canonicalUrl: z.string().optional(),
    openGraphImage: mediaSchema.optional(),
  }).optional(),
  status: z.enum(["draft", "published", "archived", "scheduled"]),
  scheduledPublishDate: z.date().optional(),
});
