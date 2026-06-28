import { Coupon } from "@/models/coupon.model";
import { ICoupon } from "@/types/models/coupon.types";

export class CouponRepository {
  static async findValidCoupon(code: string): Promise<ICoupon | null> {
    return Coupon.findOne({ 
      code: code.toUpperCase(),
      active: true,
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: { $gt: new Date() } }
      ]
    }).lean();
  }

  static async incrementUsage(id: string): Promise<void> {
    await Coupon.findByIdAndUpdate(id, { $inc: { currentUsage: 1 } });
  }

  static async create(data: Partial<ICoupon>): Promise<ICoupon> {
    const coupon = new Coupon(data);
    return coupon.save();
  }
}
