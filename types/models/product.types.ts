import { Document, Types } from "mongoose";
import { IMedia } from "./common.types";

export interface IProductVariant {
  _id?: Types.ObjectId;
  color: string;
  size: string;
  material?: string;
  sku: string;
  barcode?: string;
  priceOverride?: number;
  salePriceOverride?: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  image?: IMedia;
  active: boolean;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  slugHistory?: string[];
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
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    openGraphImage?: IMedia;
  };
  status: "draft" | "published" | "archived" | "scheduled";
  scheduledPublishDate?: Date;
  version: number;
  historyLog?: {
    version: number;
    changedAt: Date;
    changedBy: string;
    summary: string;
  }[];
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
