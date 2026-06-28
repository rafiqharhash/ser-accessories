import { Document, Types } from "mongoose";
import { IMedia } from "./common.types";

export interface ISettings extends Document {
  _id: Types.ObjectId;
  instapayNumber?: string;
  vodafoneCashNumber?: string;
  announcementBanner?: string;
  maintenanceMode: boolean;
  websiteName: string;
  logo?: IMedia;
  favicon?: IMedia;
  heroImages?: IMedia[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  seo?: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultOpenGraphImage?: IMedia;
  };
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}
