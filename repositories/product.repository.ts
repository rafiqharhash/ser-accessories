import { Product } from "@/models/product.model";
import { IProduct } from "@/types/models/product.types";
import { Types } from "mongoose";

export class ProductRepository {
  static async findById(id: string | Types.ObjectId): Promise<IProduct | null> {
    return Product.findById(id).lean();
  }

  static async findBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug }).lean();
  }

  static async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return product.save();
  }

  static async update(id: string | Types.ObjectId, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static async softDelete(id: string | Types.ObjectId, adminId: string | Types.ObjectId): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(
      id,
      { 
        status: "archived", 
        deletedAt: new Date(),
        deletedBy: adminId
      },
      { new: true }
    ).lean();
  }

  static async getPublishedProducts({
    page = 1,
    limit = 12,
    category,
    search,
    sort = "-createdAt"
  }: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) {
    const query: Record<string, unknown> = { status: "published", deletedAt: null };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
      Product.countDocuments(query)
    ]);

    return { products, total, totalPages: Math.ceil(total / limit) };
  }
}
