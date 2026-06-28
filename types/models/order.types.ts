import { Document, Types } from "mongoose";
import { IMedia } from "./common.types";

export interface IOrderItem {
  product: Types.ObjectId;
  nameSnapshot: string;
  slugSnapshot: string;
  skuSnapshot: string;
  featuredImageSnapshot: IMedia;
  selectedColor?: string;
  selectedSize?: string;
  selectedMaterial?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  customerName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: "instapay" | "vodafone_cash" | "cod";
  paymentReference?: string;
  paymentScreenshot?: {
    publicId: string;
    secureUrl: string;
    uploadedAt: Date;
  };
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  coupon?: Types.ObjectId;
  products: IOrderItem[];
  orderStatus: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled" | "returned";
  paymentStatus: "pending" | "verified" | "rejected" | "refunded";
  history: {
    status: string;
    comment?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
