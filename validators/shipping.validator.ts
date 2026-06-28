import { z } from "zod";

export const shippingSchema = z.object({
  governorate: z.string().min(2).max(100),
  shippingPrice: z.number().min(0),
});

export type ShippingInput = z.infer<typeof shippingSchema>;
