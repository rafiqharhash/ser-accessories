import { Document, Types } from "mongoose";
import { IMedia } from "./common.types";

export interface ICollection extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  image?: IMedia;
  description?: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
