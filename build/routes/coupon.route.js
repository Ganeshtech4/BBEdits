"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("../controllers/coupon.controller");
const auth_1 = require("../middleware/auth");
const couponRouter = express_1.default.Router();
// Public route - validate coupon
couponRouter.post("/validate-coupon", coupon_controller_1.validateCoupon);
// Admin routes
couponRouter.post("/create-coupon", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), coupon_controller_1.createCoupon);
couponRouter.get("/get-coupons", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), coupon_controller_1.getAllCoupons);
couponRouter.put("/update-coupon/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), coupon_controller_1.updateCoupon);
couponRouter.delete("/delete-coupon/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), coupon_controller_1.deleteCoupon);
exports.default = couponRouter;
