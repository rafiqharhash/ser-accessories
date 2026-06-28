import { Shipping } from "@/models/shipping.model";
import { IShipping } from "@/types/models/shipping.types";

export class ShippingRepository {
  static async findAll(): Promise<IShipping[]> {
    return Shipping.find().sort({ governorate: 1 }).lean();
  }

  static async findByGovernorate(governorate: string): Promise<IShipping | null> {
    return Shipping.findOne({ governorate }).lean();
  }
}
