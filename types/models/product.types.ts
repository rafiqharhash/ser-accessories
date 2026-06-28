import { Document, Types } from "mongoose";
import { IMedia } from "./common.types";

export interface IProductVariant {
  _id?: Types.ObjectId;
  color: string;
  size: string;
  material?: string;
  sku: string;
  stock: number;
  active: boolean;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  category: Types.ObjectId;
  collectionId?: Types.ObjectId;
  brand?: string;
  gender?: "Men" | "Women" | "Unisex";
  featuredImage: IMedia;
  galleryImages: IMedia[];
  productVideo?: IMedia;
  colors: string[];
  sizes: string[];
  materials: string[];
  SKU: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  stockMode: "single" | "variant";
  stock: number;
  variantStock: IProductVariant[];
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "published" | "archived";
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
