import { Collection } from "@/models/collection.model";
import { ICollection } from "@/types/models/collection.types";
import { Types } from "mongoose";

export class CollectionRepository {
  static async findAllActive(): Promise<ICollection[]> {
    return Collection.find({ active: true }).sort({ sortOrder: 1 }).lean();
  }

  static async findBySlug(slug: string): Promise<ICollection | null> {
    return Collection.findOne({ slug, active: true }).lean();
  }

  static async create(data: Partial<ICollection>): Promise<ICollection> {
    const collection = new Collection(data);
    return collection.save();
  }

  static async update(id: string | Types.ObjectId, data: Partial<ICollection>): Promise<ICollection | null> {
    return Collection.findByIdAndUpdate(id, data, { new: true }).lean();
  }
}
