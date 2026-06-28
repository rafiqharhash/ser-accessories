"use server";

import { connectToDatabase } from "@/lib/db";
import { Media } from "@/models/media.model";
import { revalidatePath } from "next/cache";

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureString = `folder=ser-store&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  
  // Hash the signature string
  const crypto = await import("crypto");
  const signature = crypto.createHash("sha256").update(signatureString).digest("hex");
  
  return { success: true, timestamp, signature };
}

export async function getMediaLibrary() {
  await connectToDatabase();
  const media = await Media.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(media));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveMediaRecord(payload: any) {
  try {
    await connectToDatabase();
    await Media.create(payload);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to save media:", error);
    return { success: false, error: "Database error saving media record." };
  }
}

export async function deleteMediaRecord(publicId: string) {
  try {
    await connectToDatabase();
    
    // Note: In production, you would also call Cloudinary API to delete the actual file.
    // For this prototype, we're just removing it from our DB registry.
    // await cloudinary.uploader.destroy(publicId);

    await Media.deleteOne({ publicId });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, error: "Database error deleting media record." };
  }
}
