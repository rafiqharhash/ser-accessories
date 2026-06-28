import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Application
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // Database
  MONGODB_URI: z.string().min(1, "MongoDB URI is required"),
  
  // Authentication
  AUTH_SECRET: z.string().min(1, "Auth Secret is required"),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary Cloud Name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API Key is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API Secret is required"),
});

export type EnvConfig = z.infer<typeof envSchema>;
