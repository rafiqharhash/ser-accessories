import { connectToDatabase } from "@/lib/db";
import { Notification } from "@/models/notification.model";

export class NotificationService {
  static async create(payload: {
    type: string;
    severity?: "info" | "warning" | "critical";
    message: string;
    link?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
  }) {
    await connectToDatabase();
    return await Notification.create({
      ...payload,
      severity: payload.severity || "info"
    });
  }

  static async notifyNewOrder(orderId: string, orderNumber: string, totalAmount: number) {
    return this.create({
      type: "NEW_ORDER",
      severity: "info",
      message: `New Order #${orderNumber} placed for EGP ${totalAmount}.`,
      link: `/admin/orders/${orderId}`,
      metadata: { orderId, orderNumber, totalAmount }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async sendStatusUpdate(order: any, status: string) {
    return this.create({
      type: "ORDER_STATUS_UPDATE",
      severity: "info",
      message: `Order #${order.orderNumber} status changed to ${status}.`,
      link: `/admin/orders/${order._id}`,
      metadata: { orderId: order._id, status }
    });
  }

  static async notifyLowStock(productName: string, productId: string, currentStock: number) {
    return this.create({
      type: "LOW_STOCK",
      severity: "warning",
      message: `${productName} is running low on stock (${currentStock} left).`,
      link: `/admin/products/${productId}`,
      metadata: { productId, currentStock }
    });
  }

  static async notifyNewReview(productName: string, productId: string, rating: number) {
    return this.create({
      type: "NEW_REVIEW",
      severity: "info",
      message: `New ${rating}-star review on ${productName} awaiting approval.`,
      link: `/admin/reviews`,
      metadata: { productId, rating }
    });
  }
}
