import { z } from "zod";

export const mediaSchema = z.object({
  publicId: z.string().min(1, "Public ID is required"),
  secureUrl: z.string().url("Invalid URL"),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  altText: z.string().optional(),
  displayOrder: z.number().int().default(0),
});
