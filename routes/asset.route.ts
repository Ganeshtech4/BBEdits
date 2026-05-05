import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createAsset,
  updateAsset,
  deleteAsset,
  getAdminAssets,
  getPublishedAssets,
  getPublishedAssetById,
  getDownloadUrl,
  createAssetPaymentOrder,
  purchaseAsset,
} from "../controllers/asset.controller";

const assetRouter = express.Router();

// Admin routes
assetRouter.post("/create-asset", isAutheticated, authorizeRoles("admin"), createAsset);
assetRouter.put("/update-asset/:id", isAutheticated, authorizeRoles("admin"), updateAsset);
assetRouter.delete("/delete-asset/:id", isAutheticated, authorizeRoles("admin"), deleteAsset);
assetRouter.get("/get-admin-assets", isAutheticated, authorizeRoles("admin"), getAdminAssets);

// User routes (requires login)
assetRouter.get("/get-assets", isAutheticated, getPublishedAssets);
assetRouter.get("/get-asset/:id", isAutheticated, getPublishedAssetById);
assetRouter.get("/get-asset-download/:id", isAutheticated, getDownloadUrl);
assetRouter.post("/asset-payment/create-order/:id", isAutheticated, createAssetPaymentOrder);
assetRouter.post("/purchase-asset/:id", isAutheticated, purchaseAsset);

export default assetRouter;
