export interface IMedia {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  altText?: string;
  displayOrder: number;
}
