"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRazorpayOrder = exports.sendRazorpayKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
const coupon_controller_1 = require("./coupon.controller");
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, payment_info, couponCode } = req.body;
        if (payment_info) {
            if ("razorpay_payment_id" in payment_info && "razorpay_order_id" in payment_info && "razorpay_signature" in payment_info) {
                // Verify Razorpay payment signature
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
        }
        const user = await user_model_1.default.findById(req.user?._id);
        const courseExistInUser = user?.courses.some((course) => {
            // Handle both old format (_id) and new format (courseId)
            const id = course.courseId || course._id || course;
            return id.toString() === courseId;
        });
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const data = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };
        // Manual render check removed to prevent build path issues
        try {
            if (user) {
                // Send confirmation email to student
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
                // Send notification email to admin
                const adminMailData = {
                    order: {
                        _id: course._id.toString().slice(0, 6),
                        name: course.name,
                        price: course.price,
                        date: new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }),
                        studentName: user.name,
                        studentEmail: user.email,
                    },
                    adminDashboardUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/admin/invoices`,
                };
                await (0, sendMail_1.default)({
                    email: process.env.SMTP_MAIL || 'support@bbedits.in',
                    subject: "New Course Purchase - Order Notification",
                    template: "new-order-admin.ejs",
                    data: adminMailData,
                });
            }
        }
        catch (error) {
            console.error("Email sending failed:", error.message);
            // Continue to enrollment even if email fails
        }
        user?.courses.push({ courseId: course?._id.toString() });
        await user?.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user), "EX", 604800);
        await notification_Model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });
        course.purchased = course.purchased + 1;
        await course.save();
        // Increment coupon usage count if coupon was used
        if (couponCode) {
            await (0, coupon_controller_1.incrementCouponUsage)(couponCode);
        }
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get All orders --- only for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//  send razorpay key
exports.sendRazorpayKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
});
// create razorpay order
exports.createRazorpayOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                company: "BB Edits",
                description: "BB Edits course services",
            },
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json({
            success: true,
            order,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
