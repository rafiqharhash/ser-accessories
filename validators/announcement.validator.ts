import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(2).max(100),
  message: z.string().min(2).max(500),
  active: z.boolean().default(true),
  startDate: z.date().or(z.string().transform(str => new Date(str))).optional(),
  endDate: z.date().or(z.string().transform(str => new Date(str))).optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
