import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export class CloudinaryService {
  /**
   * Uploads an image to Cloudinary and applies automatic optimization.
   * Format is set to auto to deliver WebP/AVIF depending on the browser.
   */
  static async uploadImage(fileBuffer: Buffer, folder: string = "ser/products"): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          format: "auto",
          quality: "auto",
        },
        (error, result) => {
          if (error || !result) {
            logger.error("Cloudinary Image Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Uploads a video to Cloudinary with automatic optimization.
   */
  static async uploadVideo(fileBuffer: Buffer, folder: string = "ser/videos"): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "video",
          format: "auto",
          quality: "auto",
        },
        (error, result) => {
          if (error || !result) {
            logger.error("Cloudinary Video Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes an asset from Cloudinary using its public ID.
   */
  static async deleteAsset(publicId: string, resourceType: "image" | "video" = "image"): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return result.result === "ok";
    } catch (error) {
      logger.error(`Error deleting asset ${publicId}:`, error);
      return false;
    }
  }

  /**
   * Helper to replace an asset. Deletes the old one and uploads the new one.
   */
  static async replaceImage(oldPublicId: string, newFileBuffer: Buffer, folder: string): Promise<UploadApiResponse> {
    if (oldPublicId) {
      await this.deleteAsset(oldPublicId, "image");
    }
    return this.uploadImage(newFileBuffer, folder);
  }
}
