import { Order } from "@/models/order.model";
import { IOrder } from "@/types/models/order.types";
import { Types } from "mongoose";

export class OrderRepository {
  static async findById(id: string | Types.ObjectId): Promise<IOrder | null> {
    return Order.findById(id).lean();
  }

  static async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    return Order.findOne({ orderNumber }).lean();
  }

  static async create(data: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(data);
    return order.save();
  }

  static async updateStatus(
    id: string | Types.ObjectId, 
    orderStatus: IOrder["orderStatus"], 
    paymentStatus?: IOrder["paymentStatus"]
  ): Promise<IOrder | null> {
    const updateData: Record<string, unknown> = { orderStatus };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    return Order.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  static async getOrders({
    page = 1,
    limit = 10,
    status,
    phone
  }: {
    page?: number;
    limit?: number;
    status?: string;
    phone?: string;
  }) {
    const query: Record<string, unknown> = {};
    if (status) query.orderStatus = status;
    if (phone) query.phone = phone;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    return { orders, total, totalPages: Math.ceil(total / limit) };
  }
}
