import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createBundle,
  editBundle,
  deleteBundle,
  getAdminAllBundles,
  getActiveBundles,
  createBundleOrder,
  createBundleRazorpayOrder,
} from "../controllers/bundle.controller";

const bundleRouter = express.Router();

// Public
bundleRouter.get("/get-bundles", getActiveBundles);

// Authenticated users
bundleRouter.post("/create-bundle-order", isAutheticated, createBundleOrder);
bundleRouter.post("/bundle/create-razorpay-order", isAutheticated, createBundleRazorpayOrder);

// Admin only
bundleRouter.post("/create-bundle", isAutheticated, authorizeRoles("admin"), createBundle);
bundleRouter.put("/edit-bundle/:id", isAutheticated, authorizeRoles("admin"), editBundle);
bundleRouter.delete("/delete-bundle/:id", isAutheticated, authorizeRoles("admin"), deleteBundle);
bundleRouter.get("/get-admin-bundles", isAutheticated, authorizeRoles("admin"), getAdminAllBundles);

export default bundleRouter;
