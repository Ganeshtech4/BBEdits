"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundleOrder = exports.createBundleRazorpayOrder = exports.getActiveBundles = exports.getAdminAllBundles = exports.deleteBundle = exports.editBundle = exports.createBundle = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const bundle_model_1 = __importDefault(require("../models/bundle.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_Model_1 = __importDefault(require("../models/order.Model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const redis_1 = require("../utils/redis");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// Create bundle — admin only
exports.createBundle = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, description, courses, price, originalPrice, thumbnail, isActive } = req.body;
        if (!name || !description || !courses || !price) {
            return next(new ErrorHandler_1.default("Please provide all required fields", 400));
        }
        if (!Array.isArray(courses) || courses.length < 2) {
            return next(new ErrorHandler_1.default("A bundle must include at least 2 courses", 400));
        }
        const bundle = await bundle_model_1.default.create({
            name,
            description,
            courses,
            price,
            originalPrice,
            thumbnail,
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json({ success: true, bundle });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Edit bundle — admin only
exports.editBundle = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const bundle = await bundle_model_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!bundle)
            return next(new ErrorHandler_1.default("Bundle not found", 404));
        res.status(200).json({ success: true, bundle });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete bundle — admin only
exports.deleteBundle = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const bundle = await bundle_model_1.default.findByIdAndDelete(req.params.id);
        if (!bundle)
            return next(new ErrorHandler_1.default("Bundle not found", 404));
        res.status(200).json({ success: true, message: "Bundle deleted successfully" });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all bundles — admin
exports.getAdminAllBundles = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const bundles = await bundle_model_1.default.find().populate("courses", "name price thumbnail");
        res.status(200).json({ success: true, bundles });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get active bundles — public
exports.getActiveBundles = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const bundles = await bundle_model_1.default.find({ isActive: true }).populate("courses", "name price thumbnail courseData ratings purchased");
        res.status(200).json({ success: true, bundles });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Create Razorpay order for bundle — used by frontend before checkout
exports.createBundleRazorpayOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `bundle_receipt_${Date.now()}`,
            notes: { company: "BB Edits", description: "BB Edits bundle purchase" },
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json({ success: true, order });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Purchase bundle — enroll user in all bundle courses
exports.createBundleOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { bundleId, payment_info } = req.body;
        // Verify Razorpay signature
        if (payment_info &&
            "razorpay_payment_id" in payment_info &&
            "razorpay_order_id" in payment_info &&
            "razorpay_signature" in payment_info) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payment_info;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");
            if (razorpay_signature !== expectedSign) {
                return next(new ErrorHandler_1.default("Payment verification failed!", 400));
            }
        }
        const bundle = await bundle_model_1.default.findById(bundleId).populate("courses", "name price purchased");
        if (!bundle)
            return next(new ErrorHandler_1.default("Bundle not found", 404));
        const user = await user_model_1.default.findById(req.user?._id);
        if (!user)
            return next(new ErrorHandler_1.default("User not found", 404));
        const newCourseIds = [];
        for (const course of bundle.courses) {
            const alreadyEnrolled = user.courses.some((c) => {
                const id = c.courseId || c._id || c;
                return id.toString() === course._id.toString();
            });
            if (!alreadyEnrolled) {
                newCourseIds.push(course._id.toString());
            }
        }
        if (newCourseIds.length === 0) {
            return next(new ErrorHandler_1.default("You are already enrolled in all courses in this bundle", 400));
        }
        // Enroll user in each new course
        for (const courseId of newCourseIds) {
            user.courses.push({ courseId });
            // Increment purchased count on course
            await course_model_1.default.findByIdAndUpdate(courseId, { $inc: { purchased: 1 } });
            // Create individual order records for invoicing
            await order_Model_1.default.create({
                courseId,
                userId: user._id,
                payment_info,
            });
        }
        await user.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user), "EX", 604800);
        bundle.purchased = (bundle.purchased || 0) + 1;
        await bundle.save();
        await notification_Model_1.default.create({
            user: user._id,
            title: "Bundle Purchased",
            message: `You have successfully purchased the "${bundle.name}" bundle`,
        });
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Bundle Purchase Confirmation",
                template: "order-confirmation.ejs",
                data: {
                    order: {
                        _id: bundle._id.toString().slice(0, 6),
                        name: bundle.name,
                        price: bundle.price,
                        date: new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }),
                    },
                },
            });
        }
        catch (mailErr) {
            console.error("Bundle order email failed:", mailErr.message);
        }
        res.status(201).json({ success: true, message: "Bundle purchased successfully", newCourseIds });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
