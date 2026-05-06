import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import BundleModel from "../models/bundle.model";
import CourseModel from "../models/course.model";
import cloudinary from "cloudinary";
import OrderModel from "../models/order.Model";
import userModel from "../models/user.model";
import NotificationModel from "../models/notification.Model";
import { redis } from "../utils/redis";
import sendMail from "../utils/sendMail";
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create bundle — admin only
export const createBundle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, courses, price, originalPrice, thumbnail, isActive } = req.body;

      if (!name || !description || !courses || !price) {
        return next(new ErrorHandler("Please provide all required fields", 400));
      }
      if (!Array.isArray(courses) || courses.length < 2) {
        return next(new ErrorHandler("A bundle must include at least 2 courses", 400));
      }

      // Handle thumbnail upload
      let thumbnailData: { public_id: string; url: string } | undefined;
      if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("data:")) {
        const result = await cloudinary.v2.uploader.upload(thumbnail, { folder: "bundles" });
        thumbnailData = { public_id: result.public_id, url: result.secure_url };
      } else if (thumbnail && typeof thumbnail === "object") {
        thumbnailData = thumbnail;
      }

      const bundle = await BundleModel.create({
        name,
        description,
        courses,
        price,
        originalPrice,
        thumbnail: thumbnailData,
        isActive: isActive !== undefined ? isActive : true,
      });

      res.status(201).json({ success: true, bundle });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Edit bundle — admin only
export const editBundle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateData: any = { ...req.body };

      // Handle thumbnail update
      if (updateData.thumbnail) {
        if (typeof updateData.thumbnail === "string" && updateData.thumbnail.startsWith("data:")) {
          // New base64 image — upload to Cloudinary
          const existing = await BundleModel.findById(req.params.id);
          if (existing?.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(existing.thumbnail.public_id);
          }
          const result = await cloudinary.v2.uploader.upload(updateData.thumbnail, { folder: "bundles" });
          updateData.thumbnail = { public_id: result.public_id, url: result.secure_url };
        } else if (typeof updateData.thumbnail === "string" && updateData.thumbnail.startsWith("http")) {
          // Existing URL passed back — reconstruct object
          const existing = await BundleModel.findById(req.params.id);
          updateData.thumbnail = {
            url: updateData.thumbnail,
            public_id: existing?.thumbnail?.url === updateData.thumbnail ? (existing?.thumbnail?.public_id || "") : "",
          };
        }
        // If already an object, keep as-is
      } else {
        delete updateData.thumbnail;
      }

      const bundle = await BundleModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
      if (!bundle) return next(new ErrorHandler("Bundle not found", 404));
      res.status(200).json({ success: true, bundle });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete bundle — admin only
export const deleteBundle = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bundle = await BundleModel.findByIdAndDelete(req.params.id);
      if (!bundle) return next(new ErrorHandler("Bundle not found", 404));
      res.status(200).json({ success: true, message: "Bundle deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all bundles — admin
export const getAdminAllBundles = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bundles = await BundleModel.find().populate("courses", "name price thumbnail");
      res.status(200).json({ success: true, bundles });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get active bundles — public
export const getActiveBundles = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bundles = await BundleModel.find({ isActive: true }).populate(
        "courses",
        "name price thumbnail courseData ratings purchased"
      );
      res.status(200).json({ success: true, bundles });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Create Razorpay order for bundle — used by frontend before checkout
export const createBundleRazorpayOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Purchase bundle — enroll user in all bundle courses
export const createBundleOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bundleId, payment_info } = req.body as {
        bundleId: string;
        payment_info: any;
      };

      // Verify Razorpay signature
      if (
        payment_info &&
        "razorpay_payment_id" in payment_info &&
        "razorpay_order_id" in payment_info &&
        "razorpay_signature" in payment_info
      ) {
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

      const bundle = await BundleModel.findById(bundleId).populate<{
        courses: Array<{ _id: any; name: string; price: number; purchased: number; save: () => Promise<any> }>;
      }>("courses", "name price purchased");

      if (!bundle) return next(new ErrorHandler("Bundle not found", 404));

      const user = await userModel.findById(req.user?._id);
      if (!user) return next(new ErrorHandler("User not found", 404));

      const newCourseIds: string[] = [];

      for (const course of bundle.courses) {
        const alreadyEnrolled = user.courses.some((c: any) => {
          const id = c.courseId || c._id || c;
          return id.toString() === course._id.toString();
        });
        if (!alreadyEnrolled) {
          newCourseIds.push(course._id.toString());
        }
      }

      if (newCourseIds.length === 0) {
        return next(new ErrorHandler("You are already enrolled in all courses in this bundle", 400));
      }

      // Enroll user in each new course
      for (const courseId of newCourseIds) {
        user.courses.push({ courseId });
        // Increment purchased count on course
        await CourseModel.findByIdAndUpdate(courseId, { $inc: { purchased: 1 } });
        // Create individual order records for invoicing
        await OrderModel.create({
          courseId,
          userId: user._id,
          payment_info,
        });
      }

      await user.save();
      await redis.set(req.user?._id, JSON.stringify(user), "EX", 604800);

      bundle.purchased = (bundle.purchased || 0) + 1;
      await bundle.save();

      await NotificationModel.create({
        user: user._id,
        title: "Bundle Purchased",
        message: `You have successfully purchased the "${bundle.name}" bundle`,
      });

      try {
        await sendMail({
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
      } catch (mailErr: any) {
        console.error("Bundle order email failed:", mailErr.message);
      }

      res.status(201).json({ success: true, message: "Bundle purchased successfully", newCourseIds });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
