"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const CouponModel = (0, mongoose_1.model)("Coupon", couponSchema);
exports.default = CouponModel;
