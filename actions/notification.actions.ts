"use server";

import { connectToDatabase } from "@/lib/db";
import { Notification } from "@/models/notification.model";

export async function getAdminNotifications() {
  await connectToDatabase();
  // Fetch up to 20 unread, then recent read ones.
  const notifications = await Notification.find({})
    .sort({ readAt: 1, createdAt: -1 })
    .limit(20)
    .lean();
    
  const unreadCount = await Notification.countDocuments({ readAt: null });

  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    unreadCount
  };
}

export async function markNotificationAsRead(id: string) {
  try {
    await connectToDatabase();
    await Notification.findByIdAndUpdate(id, { readAt: new Date() });
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    await connectToDatabase();
    await Notification.updateMany({ readAt: null }, { readAt: new Date() });
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false };
  }
}
