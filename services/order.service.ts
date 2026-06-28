import { OrderRepository } from "@/repositories/order.repository";
import { ProductRepository } from "@/repositories/product.repository";
import { CouponRepository } from "@/repositories/coupon.repository";
import { CreateOrderInput } from "@/validators/order.validator";
import { APIError } from "@/utils/errors";
import { IOrderItem } from "@/types/models/order.types";

export class OrderService {
  /**
   * Complex business logic for order creation:
   * 1. Validate products and fetch snapshots
   * 2. Verify stock availability (and deduct - omitted for brevity but would happen here)
   * 3. Apply coupon validation and calculate totals
   * 4. Create the order
   */
  static async createOrder(data: CreateOrderInput) {
    let subtotal = 0;
    const orderItems: IOrderItem[] = [];

    // 1. Validate Products & Build Snapshots
    for (const item of data.products) {
      const product = await ProductRepository.findById(item.product);
      if (!product || product.status !== "published") {
        throw new APIError(`Product ${item.product} is not available`, 400);
      }

      // Check stock logic would go here depending on stockMode (single vs variant)
      // For now, we assume stock is available
      
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        nameSnapshot: product.name,
        slugSnapshot: product.slug,
        skuSnapshot: product.SKU,
        featuredImageSnapshot: product.featuredImage,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    let discount = 0;
    let couponId = undefined;

    // 2. Validate Coupon
    if (data.couponCode) {
      const coupon = await CouponRepository.findValidCoupon(data.couponCode);
      if (!coupon) {
        throw new APIError("Invalid or expired coupon code", 400);
      }
      if (coupon.minimumPurchase && subtotal < coupon.minimumPurchase) {
        throw new APIError(`Minimum purchase of ${coupon.minimumPurchase} required for this coupon`, 400);
      }

      if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
      } else {
        discount = (subtotal * coupon.discountValue) / 100;
      }

      if (discount > subtotal) discount = subtotal;

      couponId = coupon._id;

      // Increment coupon usage
      await CouponRepository.incrementUsage(coupon._id.toString());
    }

    // 3. Calculate Totals (Assuming flat shipping rate for now, or fetch from ShippingRepository)
    // The client sends Governorate, so ideally we fetch the price.
    // For this demonstration, we'll assume the frontend passed a validated shipping cost, or we calculate it here.
    const shippingCost = 50; // Placeholder: await ShippingRepository.findByGovernorate(data.governorate)
    const total = subtotal - discount + shippingCost;

    // Generate Order Number
    const orderNumber = `SER-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 4. Create Order
    const order = await OrderRepository.create({
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      governorate: data.governorate,
      city: data.city,
      address: data.address,
      notes: data.notes,
      paymentMethod: data.paymentMethod,
      paymentScreenshot: data.paymentScreenshot,
      subtotal,
      shippingCost,
      discount,
      total,
      coupon: couponId,
      products: orderItems,
      orderStatus: "pending",
      paymentStatus: "pending"
    });

    return order;
  }
}
