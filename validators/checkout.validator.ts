import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, "Invalid Egyptian phone number"),
  governorate: z.string().min(2, "Please select a governorate"),
  city: z.string().min(2, "City/Area is required"),
  address: z.string().min(10, "Please provide a detailed address"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["instapay", "vodafone_cash", "cod"]),
  paymentReference: z.string().optional(),
  paymentScreenshot: z.object({
    publicId: z.string(),
    secureUrl: z.string(),
  }).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
