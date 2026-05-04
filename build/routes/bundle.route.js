"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const bundle_controller_1 = require("../controllers/bundle.controller");
const bundleRouter = express_1.default.Router();
// Public
bundleRouter.get("/get-bundles", bundle_controller_1.getActiveBundles);
// Authenticated users
bundleRouter.post("/create-bundle-order", auth_1.isAutheticated, bundle_controller_1.createBundleOrder);
bundleRouter.post("/bundle/create-razorpay-order", auth_1.isAutheticated, bundle_controller_1.createBundleRazorpayOrder);
// Admin only
bundleRouter.post("/create-bundle", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), bundle_controller_1.createBundle);
bundleRouter.put("/edit-bundle/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), bundle_controller_1.editBundle);
bundleRouter.delete("/delete-bundle/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), bundle_controller_1.deleteBundle);
bundleRouter.get("/get-admin-bundles", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), bundle_controller_1.getAdminAllBundles);
exports.default = bundleRouter;
