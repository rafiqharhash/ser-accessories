"use server";

import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/models/settings.model";
import { AuditLog } from "@/models/audit-log.model";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStoreSettings() {
  await connectToDatabase();
  let settings = await Settings.findOne().lean();
  
  if (!settings) {
    // Initialize defaults if none exist
    const newSettings = new Settings({
      websiteName: "SER | سِر",
      maintenanceMode: false,
      lowStockThreshold: 5,
    });
    await newSettings.save();
    settings = await Settings.findOne().lean();
  }

  return JSON.parse(JSON.stringify(settings));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateStoreSettings(payload: any, adminName: string = "Administrator") {
  try {
    await connectToDatabase();
    
    const settings = await Settings.findOne();
    if (!settings) throw new Error("Settings not found");

    Object.assign(settings, payload);
    await settings.save();

    // Log the action
    await AuditLog.create({
      admin: adminName,
      action: "UPDATE_SETTINGS",
      resource: "Settings",
      details: "Updated global store settings",
    });

    revalidatePath("/", "layout"); // Revalidate entire app to reflect branding/maintenance changes
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to save settings." };
  }
}
