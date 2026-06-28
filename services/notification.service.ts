import { IOrder } from "@/types/models/order.types";

/**
 * Notification Service Stub
 * Prepared for future integration with Resend (Emails) and Twilio/Vodafone (SMS).
 */
export const NotificationService = {
  async sendOrderConfirmation(order: IOrder) {
    // Example future implementation:
    // await resend.emails.send({
    //   from: 'SER Luxury <orders@serluxury.com>',
    //   to: order.customerEmail, // Note: Order model might need email added later if not just phone
    //   subject: `Order Confirmation - ${order.orderNumber}`,
    //   react: OrderConfirmationTemplate({ order })
    // });
    console.log(`[Notification Stub] Sending confirmation for order: ${order.orderNumber}`);
  },

  async sendStatusUpdate(order: IOrder, newStatus: string) {
    // Example future SMS implementation:
    // await twilio.messages.create({
    //   body: `Your SER order ${order.orderNumber} is now ${newStatus}.`,
    //   from: process.env.TWILIO_PHONE,
    //   to: order.phone
    // });
    console.log(`[Notification Stub] Notifying customer ${order.phone} of status change to: ${newStatus}`);
  }
};
