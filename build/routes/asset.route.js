"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const asset_controller_1 = require("../controllers/asset.controller");
const assetRouter = express_1.default.Router();
// Admin routes
assetRouter.post("/create-asset", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), asset_controller_1.createAsset);
assetRouter.put("/update-asset/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), asset_controller_1.updateAsset);
assetRouter.delete("/delete-asset/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), asset_controller_1.deleteAsset);
assetRouter.get("/get-admin-assets", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), asset_controller_1.getAdminAssets);
// User routes (requires login)
assetRouter.get("/get-assets", auth_1.isAutheticated, asset_controller_1.getPublishedAssets);
assetRouter.get("/get-asset/:id", auth_1.isAutheticated, asset_controller_1.getPublishedAssetById);
assetRouter.get("/get-asset-download/:id", auth_1.isAutheticated, asset_controller_1.getDownloadUrl);
assetRouter.post("/asset-payment/create-order/:id", auth_1.isAutheticated, asset_controller_1.createAssetPaymentOrder);
assetRouter.post("/purchase-asset/:id", auth_1.isAutheticated, asset_controller_1.purchaseAsset);
exports.default = assetRouter;
