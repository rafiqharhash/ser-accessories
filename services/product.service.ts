import { ProductRepository } from "@/repositories/product.repository";
import { InventoryLogRepository } from "@/repositories/inventory-log.repository";
import { AuditLogRepository } from "@/repositories/audit-log.repository";
import { ProductInput } from "@/validators/product.validator";
import { IProduct } from "@/types/models/product.types";
import { Types } from "mongoose";
import { APIError } from "@/utils/errors";

export class ProductService {
  /**
   * Creates a new product and logs the action
   */
  static async createProduct(data: ProductInput, adminId: string, ipAddress?: string) {
    // 1. Check if SKU or slug exists
    // (In a real scenario, we might catch the MongoDB E11000 duplicate key error, 
    // but explicit checks provide better error messages)
    
    // 2. Create the product
    const product = await ProductRepository.create(data as unknown as Partial<IProduct>);

    // 3. Log initial inventory if > 0
    if (data.stockMode === "single" && data.stock > 0) {
      await InventoryLogRepository.createLog({
        product: product._id,
        previousStock: 0,
        newStock: data.stock,
        reason: "Initial product creation",
        admin: adminId,
      });
    } else if (data.stockMode === "variant" && data.variantStock.length > 0) {
      for (const variant of data.variantStock) {
        if (variant.stock > 0) {
          // Assume variant gets an _id during save
          const savedVariant = product.variantStock.find(v => v.sku === variant.sku);
          if (savedVariant) {
            await InventoryLogRepository.createLog({
              product: product._id,
              variant: savedVariant._id as Types.ObjectId,
              previousStock: 0,
              newStock: variant.stock,
              reason: "Initial variant creation",
              admin: adminId,
            });
          }
        }
      }
    }

    // 4. Audit Log
    await AuditLogRepository.createLog({
      action: "CREATE",
      entity: "Product",
      entityId: product._id.toString(),
      admin: adminId,
      ipAddress,
    });

    return product;
  }

  /**
   * Soft deletes a product and logs the action
   */
  static async archiveProduct(productId: string, adminId: string, ipAddress?: string) {
    const product = await ProductRepository.softDelete(productId, adminId);
    if (!product) throw new APIError("Product not found", 404);

    await AuditLogRepository.createLog({
      action: "ARCHIVE",
      entity: "Product",
      entityId: productId,
      admin: adminId,
      ipAddress,
    });

    return product;
  }
}
