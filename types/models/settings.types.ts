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
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
