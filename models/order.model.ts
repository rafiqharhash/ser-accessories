import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/types/models/order.types";

const mediaSchema = new Schema({
  publicId: { type: String, required: true },
  secureUrl: { type: String, required: true },
  width: Number,
  height: Number,
  format: String,
  bytes: Number,
  altText: String,
  displayOrder: { type: Number, default: 0 },
});

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  nameSnapshot: { type: String, required: true },
  slugSnapshot: { type: String, required: true },
  skuSnapshot: { type: String, required: true },
  featuredImageSnapshot: { type: mediaSchema, required: true },
  selectedColor: String,
  selectedSize: String,
  selectedMaterial: String,
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  lineTotal: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    notes: String,
    paymentMethod: { type: String, enum: ["instapay", "vodafone_cash", "cod"], required: true },
    paymentScreenshot: {
      publicId: String,
      secureUrl: String,
      uploadedAt: Date,
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    products: [orderItemSchema],
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ phone: 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
