import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import { incrementCouponUsage } from "./coupon.controller";
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info, couponCode } = req.body as IOrder & { couponCode?: string };

      if (payment_info) {
        if ("razorpay_payment_id" in payment_info && "razorpay_order_id" in payment_info && "razorpay_signature" in payment_info) {
          // Verify Razorpay payment signature
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payment_info;

          const sign = razorpay_order_id + "|" + razorpay_payment_id;
          const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest("hex");

          if (razorpay_signature !== expectedSign) {
            return next(new ErrorHandler("Payment verification failed!", 400));
          }
        }
      }

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => {
          // Handle both old format (_id) and new format (courseId)
          const id = course.courseId || course._id || course;
          return id.toString() === courseId;
        }
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
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
          await sendMail({
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

          await sendMail({
            email: process.env.SMTP_MAIL || 'support@bbedits.in',
            subject: "New Course Purchase - Order Notification",
            template: "new-order-admin.ejs",
            data: adminMailData,
          });
        }
      } catch (error: any) {
        console.error("Email sending failed:", error.message);
        // Continue to enrollment even if email fails
      }

      user?.courses.push({ courseId: course?._id.toString() });

      await user?.save();

      await redis.set(req.user?._id, JSON.stringify(user), "EX", 604800);

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      // Increment coupon usage count if coupon was used
      if (couponCode) {
        await incrementCouponUsage(couponCode);
      }

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//  send razorpay key
export const sendRazorpayKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  }
);

// create razorpay order
export const createRazorpayOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
