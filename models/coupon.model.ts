import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiresAt: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableCourses: string[]; // Array of course IDs, empty means applicable to all
  minPurchaseAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCourses: {
      type: [String],
      default: [],
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CouponModel = model<ICoupon>("Coupon", couponSchema);

export default CouponModel;
