import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(2).max(20).toUpperCase(),
  percentage: z.number().positive().max(100),
  minimumPurchase: z.number().min(0).optional(),
  expirationDate: z.date().or(z.string().transform(str => new Date(str))).optional(),
  maxUsage: z.number().int().positive().optional(),
  active: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
