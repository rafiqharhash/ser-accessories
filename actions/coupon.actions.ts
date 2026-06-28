"use server";

import { connectToDatabase } from "@/lib/db";
import { Coupon } from "@/models/coupon.model";
import { AuditLog } from "@/models/audit-log.model";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  await connectToDatabase();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(coupons));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveCoupon(id: string | null, payload: any, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    // Zod validation would ideally go here, using a simpler implementation for speed
    
    if (id) {
      await Coupon.findByIdAndUpdate(id, payload);
      await AuditLog.create({ admin: adminId, action: "UPDATE_COUPON", resource: "Coupon", resourceId: id });
    } else {
      const created = await Coupon.create(payload);
      await AuditLog.create({ admin: adminId, action: "CREATE_COUPON", resource: "Coupon", resourceId: created._id.toString() });
    }
    
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 11000) return { success: false, error: "Coupon code already exists" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Database error" };
  }
}

export async function deleteCoupons(ids: string[], adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Coupon.deleteMany({ _id: { $in: ids } });
    await AuditLog.create({ admin: adminId, action: "DELETE_COUPONS", resource: "Coupon", details: `Deleted ${ids.length} coupons` });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete coupons" };
  }
}

export async function bulkUpdateCouponStatus(ids: string[], active: boolean, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Coupon.updateMany({ _id: { $in: ids } }, { $set: { active } });
    await AuditLog.create({ admin: adminId, action: "BULK_UPDATE_COUPON_STATUS", resource: "Coupon", details: `Updated ${ids.length} coupons to active=${active}` });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to update coupons" };
  }
}
