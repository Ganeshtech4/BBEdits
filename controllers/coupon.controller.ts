import { Request, Response, NextFunction } from "express";
import CouponModel from "../models/coupon.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// Validate and apply coupon
export const validateCoupon = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, courseId, amount } = req.body;

      if (!code) {
        return next(new ErrorHandler("Coupon code is required", 400));
      }

      const coupon = await CouponModel.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return next(new ErrorHandler("Invalid coupon code", 400));
      }

      // Check if coupon is expired
      if (new Date(coupon.expiresAt) < new Date()) {
        return next(new ErrorHandler("Coupon has expired", 400));
      }

      // Check usage limit
      if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
        return next(new ErrorHandler("Coupon usage limit reached", 400));
      }

      // Check if coupon is applicable to the course
      if (
        coupon.applicableCourses.length > 0 &&
        !coupon.applicableCourses.includes(courseId)
      ) {
        return next(
          new ErrorHandler("Coupon is not applicable to this course", 400)
        );
      }

      // Check minimum purchase amount
      if (amount < coupon.minPurchaseAmount) {
        return next(
          new ErrorHandler(
            `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`,
            400
          )
        );
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = (amount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }

      // Ensure discount doesn't exceed the course price
      if (discountAmount > amount) {
        discountAmount = amount;
      }

      const finalAmount = Number((amount - discountAmount).toFixed(2));

      res.status(200).json({
        success: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount,
          finalAmount,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Create coupon - admin only
export const createCoupon = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const couponData = req.body;

      const existingCoupon = await CouponModel.findOne({
        code: couponData.code.toUpperCase(),
      });

      if (existingCoupon) {
        return next(new ErrorHandler("Coupon code already exists", 400));
      }

      const coupon = await CouponModel.create({
        ...couponData,
        code: couponData.code.toUpperCase(),
      });

      res.status(201).json({
        success: true,
        coupon,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all coupons - admin only
export const getAllCoupons = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await CouponModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update coupon - admin only
export const updateCoupon = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }

      const coupon = await CouponModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
      }

      res.status(200).json({
        success: true,
        coupon,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete coupon - admin only
export const deleteCoupon = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const coupon = await CouponModel.findByIdAndDelete(id);

      if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Increment coupon usage count
export const incrementCouponUsage = async (code: string) => {
  try {
    await CouponModel.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usageCount: 1 } }
    );
  } catch (error) {
    console.error("Error incrementing coupon usage:", error);
  }
};
