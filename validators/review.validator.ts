import { z } from "zod";

export const reviewSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
  customerName: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(5).max(1000),
  approved: z.boolean().default(false),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
