import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const couponRouter = express.Router();

// Public route - validate coupon
couponRouter.post("/validate-coupon", validateCoupon);

// Admin routes
couponRouter.post(
  "/create-coupon",
  isAutheticated,
  authorizeRoles("admin"),
  createCoupon
);

couponRouter.get(
  "/get-coupons",
  isAutheticated,
  authorizeRoles("admin"),
  getAllCoupons
);

couponRouter.put(
  "/update-coupon/:id",
  isAutheticated,
  authorizeRoles("admin"),
  updateCoupon
);

couponRouter.delete(
  "/delete-coupon/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCoupon
);

export default couponRouter;
