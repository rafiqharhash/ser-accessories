import { z } from "zod";
import { mediaSchema } from "./common.validator";

export const settingsSchema = z.object({
  instapayNumber: z.string().optional(),
  vodafoneCashNumber: z.string().optional(),
  announcementBanner: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
  websiteName: z.string().min(1).default("SER"),
  logo: mediaSchema.optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
