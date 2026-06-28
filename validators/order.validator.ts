import { z } from "zod";
import { mediaSchema } from "./common.validator";

export const orderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
  nameSnapshot: z.string(),
  slugSnapshot: z.string(),
  skuSnapshot: z.string(),
  featuredImageSnapshot: mediaSchema,
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
  selectedMaterial: z.string().optional(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  lineTotal: z.number().positive(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(8),
  governorate: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().optional(),
  paymentMethod: z.enum(["instapay", "vodafone_cash", "cod"]),
  paymentScreenshot: z.object({
    publicId: z.string(),
    secureUrl: z.string().url(),
    uploadedAt: z.date().or(z.string().transform(str => new Date(str)))
  }).optional(),
  couponCode: z.string().optional(),
  products: z.array(orderItemSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled", "returned"]),
  paymentStatus: z.enum(["pending", "verified", "rejected", "refunded"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
