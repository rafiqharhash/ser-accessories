"use server";

import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product.model";
import { AuditLog } from "@/models/audit-log.model";
import { productValidator } from "@/utils/validators/product.validator";
import { revalidatePath } from "next/cache";

export async function createProductDraft(adminId: string = "Administrator") {
  await connectToDatabase();
  
  // Creates an empty draft to establish an ID for autosaving
  const draft = await Product.create({
    name: "Untitled Draft " + Date.now(),
    slug: "draft-" + Date.now(),
    description: "Empty draft",
    price: 0,
    SKU: "DRAFT-" + Date.now(),
    status: "draft",
    category: "000000000000000000000000", // Will need a real category eventually
    featuredImage: {
      publicId: "placeholder",
      secureUrl: "https://via.placeholder.com/150",
    }
  });

  await AuditLog.create({
    admin: adminId,
    action: "CREATE_DRAFT",
    resource: "Product",
    resourceId: draft._id.toString(),
    details: "Created initial product draft",
  });

  return { success: true, id: draft._id.toString() };
}

// Removed eslint-disable as it was unused
export async function saveProduct(id: string, payload: unknown, adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    
    // 1. Zod Validation
    const parsedData = productValidator.safeParse(payload);
    if (!parsedData.success) {
      return { success: false, error: "Validation failed", issues: parsedData.error.issues };
    }

    const currentProduct = await Product.findById(id);
    if (!currentProduct) return { success: false, error: "Product not found" };

    // 2. Handle Slug History Redirects
    if (currentProduct.status === "published" && parsedData.data.slug !== currentProduct.slug) {
      // If the slug changed on a published product, push the old slug to history
      if (!currentProduct.slugHistory.includes(currentProduct.slug)) {
        currentProduct.slugHistory.push(currentProduct.slug);
      }
    }

    // 3. Variant SKU & Duplicate Validation
    if (parsedData.data.stockMode === "variant" && parsedData.data.variantStock) {
      const skus = parsedData.data.variantStock.map(v => v.sku);
      if (new Set(skus).size !== skus.length) {
         return { success: false, error: "Duplicate SKUs found across variants" };
      }
    }

    // 4. Update Document
    Object.assign(currentProduct, parsedData.data);
    
    // 5. Increment Version & History
    currentProduct.version += 1;
    currentProduct.historyLog.push({
      version: currentProduct.version,
      changedAt: new Date(),
      changedBy: adminId,
      summary: `Product updated to status: ${parsedData.data.status}`
    });

    await currentProduct.save();

    await AuditLog.create({
      admin: adminId,
      action: "UPDATE_PRODUCT",
      resource: "Product",
      resourceId: id,
      details: `Updated product, new version: ${currentProduct.version}`,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/shop/${currentProduct.slug}`);
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Save product failed:", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error && typeof error === "object" && (error as any).code === 11000) {
      return { success: false, error: "Duplicate value error (Slug or Master SKU must be unique)" };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false, error: (error as any).message || "Unknown error" };
  }
}

export async function deleteProducts(ids: string[], adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Product.deleteMany({ _id: { $in: ids } });
    
    await AuditLog.create({
      admin: adminId,
      action: "DELETE_PRODUCTS",
      resource: "Product",
      details: `Deleted ${ids.length} products`,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete products" };
  }
}

export async function bulkUpdateProductStatus(ids: string[], status: "published" | "draft" | "archived", adminId: string = "Administrator") {
  try {
    await connectToDatabase();
    await Product.updateMany(
      { _id: { $in: ids } }, 
      { 
        $set: { status },
        $inc: { version: 1 },
        $push: { 
          historyLog: {
            version: 0, // Simplified for bulk
            changedAt: new Date(),
            changedBy: adminId,
            summary: `Bulk status update to ${status}`
          }
        }
      }
    );

    await AuditLog.create({
      admin: adminId,
      action: `BULK_${status.toUpperCase()}_PRODUCTS`,
      resource: "Product",
      details: `Updated ${ids.length} products`,
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to bulk update products" };
  }
}
