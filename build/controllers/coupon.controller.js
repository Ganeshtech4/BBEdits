"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementCouponUsage = exports.deleteCoupon = exports.updateCoupon = exports.getAllCoupons = exports.createCoupon = exports.validateCoupon = void 0;
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Validate and apply coupon
exports.validateCoupon = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { code, courseId, amount } = req.body;
        if (!code) {
            return next(new ErrorHandler_1.default("Coupon code is required", 400));
        }
        const coupon = await coupon_model_1.default.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });
        if (!coupon) {
            return next(new ErrorHandler_1.default("Invalid coupon code", 400));
        }
        // Check if coupon is expired
        if (new Date(coupon.expiresAt) < new Date()) {
            return next(new ErrorHandler_1.default("Coupon has expired", 400));
        }
        // Check usage limit
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
            return next(new ErrorHandler_1.default("Coupon usage limit reached", 400));
        }
        // Check if coupon is applicable to the course
        if (coupon.applicableCourses.length > 0 &&
            !coupon.applicableCourses.includes(courseId)) {
            return next(new ErrorHandler_1.default("Coupon is not applicable to this course", 400));
        }
        // Check minimum purchase amount
        if (amount < coupon.minPurchaseAmount) {
            return next(new ErrorHandler_1.default(`Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`, 400));
        }
        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (amount * coupon.discountValue) / 100;
        }
        else {
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Create coupon - admin only
exports.createCoupon = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const couponData = req.body;
        const existingCoupon = await coupon_model_1.default.findOne({
            code: couponData.code.toUpperCase(),
        });
        if (existingCoupon) {
            return next(new ErrorHandler_1.default("Coupon code already exists", 400));
        }
        const coupon = await coupon_model_1.default.create({
            ...couponData,
            code: couponData.code.toUpperCase(),
        });
        res.status(201).json({
            success: true,
            coupon,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all coupons - admin only
exports.getAllCoupons = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const coupons = await coupon_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            coupons,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update coupon - admin only
exports.updateCoupon = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }
        const coupon = await coupon_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!coupon) {
            return next(new ErrorHandler_1.default("Coupon not found", 404));
        }
        res.status(200).json({
            success: true,
            coupon,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete coupon - admin only
exports.deleteCoupon = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await coupon_model_1.default.findByIdAndDelete(id);
        if (!coupon) {
            return next(new ErrorHandler_1.default("Coupon not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Increment coupon usage count
const incrementCouponUsage = async (code) => {
    try {
        await coupon_model_1.default.findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usageCount: 1 } });
    }
    catch (error) {
        console.error("Error incrementing coupon usage:", error);
    }
};
exports.incrementCouponUsage = incrementCouponUsage;
