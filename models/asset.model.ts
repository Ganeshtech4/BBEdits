import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAssetImage {
  public_id: string;
  url: string;
}

export interface IAsset extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileUrlType: "googledrive" | "bunnynet" | "custom";
  thumbnail: IAssetImage;
  thumbnails: IAssetImage[];
  price: number;
  isPaid: boolean;
  category: string;
  tags: string[];
  downloadCount: number;
  purchasedUsers: string[];
  isPublished: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetImageSchema = {
  public_id: { type: String, default: "" },
  url: { type: String, default: "" },
};

const assetSchema = new Schema<IAsset>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    fileUrlType: {
      type: String,
      enum: ["googledrive", "bunnynet", "custom"],
      default: "custom",
    },
    thumbnail: { type: assetImageSchema, default: () => ({ public_id: "", url: "" }) },
    thumbnails: { type: [assetImageSchema], default: [] },
    price: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    downloadCount: { type: Number, default: 0 },
    purchasedUsers: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AssetModel: Model<IAsset> = mongoose.model("Asset", assetSchema);
export default AssetModel;
