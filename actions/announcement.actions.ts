"use server";

import { connectToDatabase } from "@/lib/db";
import { Announcement } from "@/models/announcement.model";
import { AuditLog } from "@/models/audit-log.model";
import { revalidatePath } from "next/cache";

export async function getAdminAnnouncements() {
  await connectToDatabase();
  const announcements = await Announcement.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(announcements));
}

export async function getActiveAnnouncements() {
  await connectToDatabase();
  const now = new Date();
  
  const announcements = await Announcement.find({
    active: true,
    $or: [
      { startDate: { $exists: false }, endDate: { $exists: false } },
      { startDate: { $lte: now }, endDate: { $exists: false } },
      { startDate: { $exists: false }, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: { $gte: now } }
    ]
  }).sort({ createdAt: -1 }).lean();
  
  return JSON.parse(JSON.stringify(announcements));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveAnnouncement(id: string | null, payload: any, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    if (id) {
      await Announcement.findByIdAndUpdate(id, payload);
      await AuditLog.create({ admin: adminId, action: "UPDATE_ANNOUNCEMENT", resource: "Announcement", resourceId: id });
    } else {
      const created = await Announcement.create(payload);
      await AuditLog.create({ admin: adminId, action: "CREATE_ANNOUNCEMENT", resource: "Announcement", resourceId: created._id.toString() });
    }
    
    revalidatePath("/", "layout"); // Revalidate entire app layout where global banner sits
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Database error" };
  }
}

export async function deleteAnnouncement(id: string, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Announcement.findByIdAndDelete(id);
    await AuditLog.create({ admin: adminId, action: "DELETE_ANNOUNCEMENT", resource: "Announcement", resourceId: id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete announcement" };
  }
}
