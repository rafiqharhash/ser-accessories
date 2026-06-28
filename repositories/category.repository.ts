import { Category } from "@/models/category.model";
import { ICategory } from "@/types/models/category.types";
import { Types } from "mongoose";

export class CategoryRepository {
  static async findAllActive(): Promise<ICategory[]> {
    return Category.find({ active: true }).sort({ sortOrder: 1 }).lean();
  }

  static async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug, active: true }).lean();
  }

  static async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return category.save();
  }

  static async update(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true }).lean();
  }
}
