"use server";

import { connectToDatabase } from "@/lib/db";
import { Shipping } from "@/models/shipping.model";
import { AuditLog } from "@/models/audit-log.model";
import { revalidatePath } from "next/cache";

export async function getShippingZones() {
  await connectToDatabase();
  const zones = await Shipping.find({}).sort({ governorate: 1 }).lean();
  return JSON.parse(JSON.stringify(zones));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveShippingZone(id: string | null, payload: any, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    if (id) {
      await Shipping.findByIdAndUpdate(id, payload);
      await AuditLog.create({ admin: adminId, action: "UPDATE_SHIPPING", resource: "Shipping", resourceId: id });
    } else {
      const created = await Shipping.create(payload);
      await AuditLog.create({ admin: adminId, action: "CREATE_SHIPPING", resource: "Shipping", resourceId: created._id.toString() });
    }
    
    revalidatePath("/admin/shipping");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) return { success: false, error: "Governorate already exists" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Database error" };
  }
}

export async function deleteShippingZone(id: string, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Shipping.findByIdAndDelete(id);
    await AuditLog.create({ admin: adminId, action: "DELETE_SHIPPING", resource: "Shipping", resourceId: id });
    revalidatePath("/admin/shipping");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete shipping zone" };
  }
}
