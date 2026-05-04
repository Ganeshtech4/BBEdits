import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBundle extends Document {
  name: string;
  description: string;
  courses: mongoose.Types.ObjectId[];
  price: number;
  originalPrice?: number;
  thumbnail?: {
    public_id: string;
    url: string;
  };
  isActive: boolean;
  purchased: number;
}

const bundleSchema = new Schema<IBundle>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    isActive: { type: Boolean, default: true },
    purchased: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BundleModel: Model<IBundle> = mongoose.model("Bundle", bundleSchema);

export default BundleModel;
