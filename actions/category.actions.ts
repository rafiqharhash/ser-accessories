"use server";

import { connectToDatabase } from "@/lib/db";
import { Category } from "@/models/category.model";
import { Collection } from "@/models/collection.model";
import { AuditLog } from "@/models/audit-log.model";
import { revalidatePath } from "next/cache";

// --- Categories ---

export async function getCategories() {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveCategory(id: string | null, payload: any, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    if (id) {
      await Category.findByIdAndUpdate(id, payload);
      await AuditLog.create({ admin: adminId, action: "UPDATE_CATEGORY", resource: "Category", resourceId: id });
    } else {
      const created = await Category.create(payload);
      await AuditLog.create({ admin: adminId, action: "CREATE_CATEGORY", resource: "Category", resourceId: created._id.toString() });
    }
    
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Database error" };
  }
}

export async function deleteCategory(id: string, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Category.findByIdAndDelete(id);
    await AuditLog.create({ admin: adminId, action: "DELETE_CATEGORY", resource: "Category", resourceId: id });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete category" };
  }
}

// --- Collections ---

export async function getCollections() {
  await connectToDatabase();
  const collections = await Collection.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(collections));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveCollection(id: string | null, payload: any, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    if (id) {
      await Collection.findByIdAndUpdate(id, payload);
      await AuditLog.create({ admin: adminId, action: "UPDATE_COLLECTION", resource: "Collection", resourceId: id });
    } else {
      const created = await Collection.create(payload);
      await AuditLog.create({ admin: adminId, action: "CREATE_COLLECTION", resource: "Collection", resourceId: created._id.toString() });
    }
    
    revalidatePath("/admin/collections");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Database error" };
  }
}

export async function deleteCollection(id: string, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Collection.findByIdAndDelete(id);
    await AuditLog.create({ admin: adminId, action: "DELETE_COLLECTION", resource: "Collection", resourceId: id });
    revalidatePath("/admin/collections");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: "Failed to delete collection" };
  }
}
