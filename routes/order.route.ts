import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  createRazorpayOrder,
  sendRazorpayKey,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAutheticated, createOrder);

orderRouter.get(
  "/get-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.get("/payment/razorpaykey", sendRazorpayKey);

orderRouter.post("/payment/create-order", isAutheticated, createRazorpayOrder);

export default orderRouter;
