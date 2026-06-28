import { z } from "zod";
import { mediaSchema } from "./common.validator";

export const collectionSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  image: mediaSchema.optional(),
  description: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
