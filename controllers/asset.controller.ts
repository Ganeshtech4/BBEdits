import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import AssetModel from "../models/asset.model";
import cloudinary from "cloudinary";
require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function uploadImage(dataUrl: string): Promise<{ public_id: string; url: string }> {
  const result = await cloudinary.v2.uploader.upload(dataUrl, { folder: "assets" });
  return { public_id: result.public_id, url: result.secure_url };
}

async function destroyImage(public_id: string) {
  if (public_id) await cloudinary.v2.uploader.destroy(public_id);
}

// ──────────── ADMIN ────────────

export const createAsset = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, fileUrl, fileUrlType, thumbnail, thumbnails, price, category, tags, isPublished, isTrending } = req.body;
      if (!title || !fileUrl) return next(new ErrorHandler("Title and file URL are required", 400));

      const numPrice = Number(price) || 0;

      // Upload primary thumbnail
      let thumbnailData = { public_id: "", url: "" };
      if (thumbnail && thumbnail.startsWith("data:")) {
        thumbnailData = await uploadImage(thumbnail);
      }

      // Upload gallery thumbnails
      const thumbnailsData: { public_id: string; url: string }[] = [];
      if (Array.isArray(thumbnails)) {
        for (const img of thumbnails) {
          if (img && img.startsWith("data:")) {
            thumbnailsData.push(await uploadImage(img));
          }
        }
      }

      const asset = await AssetModel.create({
        title,
        description: description || "",
        fileUrl,
        fileUrlType: fileUrlType || "custom",
        thumbnail: thumbnailData,
        thumbnails: thumbnailsData,
        price: numPrice,
        isPaid: numPrice > 0,
        category: category || "",
        tags: Array.isArray(tags) ? tags : [],
        isPublished: Boolean(isPublished),
        isTrending: Boolean(isTrending),
      });

      res.status(201).json({ success: true, asset });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const updateAsset = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updates: any = { ...req.body };
      if (typeof updates.price !== "undefined") {
        updates.isPaid = Number(updates.price) > 0;
      }

      const existing = await AssetModel.findById(id) as any;
      if (!existing) return next(new ErrorHandler("Asset not found", 404));

      // Handle primary thumbnail upload
      if (updates.thumbnail && updates.thumbnail.startsWith("data:")) {
        if (existing.thumbnail?.public_id) await destroyImage(existing.thumbnail.public_id);
        updates.thumbnail = await uploadImage(updates.thumbnail);
      } else if (updates.thumbnail && typeof updates.thumbnail === "string" && updates.thumbnail.startsWith("http")) {
        // Existing URL sent back — reconstruct the embedded object to avoid cast error
        updates.thumbnail = {
          url: updates.thumbnail,
          public_id: existing.thumbnail?.url === updates.thumbnail ? (existing.thumbnail?.public_id || "") : "",
        };
      } else {
        // No change or empty — keep existing
        delete updates.thumbnail;
      }

      // Handle gallery thumbnails
      if (Array.isArray(updates.thumbnails)) {
        const newGallery: { public_id: string; url: string }[] = [];
        // Destroy old images that are not kept
        for (const old of existing.thumbnails || []) {
          const kept = updates.thumbnails.find((t: any) => t === old.url || t?.url === old.url);
          if (!kept) await destroyImage(old.public_id);
        }
        for (const img of updates.thumbnails) {
          if (img && typeof img === "string" && img.startsWith("data:")) {
            newGallery.push(await uploadImage(img));
          } else if (img && typeof img === "string" && img.startsWith("http")) {
            // Existing URL — find and keep the full object
            const found = (existing.thumbnails || []).find((t: any) => t.url === img);
            if (found) newGallery.push(found);
          } else if (img && img.url) {
            newGallery.push(img);
          }
        }
        updates.thumbnails = newGallery;
      }

      const asset = await AssetModel.findByIdAndUpdate(id, updates, { new: true });
      if (!asset) return next(new ErrorHandler("Asset not found", 404));
      res.json({ success: true, asset });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const deleteAsset = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await AssetModel.findByIdAndDelete(id);
      if (!asset) return next(new ErrorHandler("Asset not found", 404));
      res.json({ success: true, message: "Asset deleted" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getAdminAssets = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assets = await AssetModel.find().sort({ createdAt: -1 });
      res.json({ success: true, assets });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// ──────────── USER ────────────

export const getPublishedAssetById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await AssetModel.findOne({ _id: id, isPublished: true }).select("-fileUrl");
      if (!asset) return next(new ErrorHandler("Asset not found", 404));
      const userId = req.user?._id?.toString();
      const result = {
        ...asset.toObject(),
        hasPurchased: asset.isPaid ? asset.purchasedUsers.includes(userId!) : true,
      };
      res.json({ success: true, asset: result });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getPublishedAssets = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assets = await AssetModel.find({ isPublished: true })
        .select("-fileUrl") // hide download link from listing
        .sort({ createdAt: -1 });

      const userId = req.user?._id?.toString();
      const enriched = assets.map((a: any) => ({
        ...a.toObject(),
        hasPurchased: a.isPaid ? a.purchasedUsers.includes(userId) : true,
      }));

      res.json({ success: true, assets: enriched });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getDownloadUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await AssetModel.findById(id);
      if (!asset || !asset.isPublished) return next(new ErrorHandler("Asset not found", 404));

      const userId = req.user?._id?.toString();
      if (asset.isPaid && !asset.purchasedUsers.includes(userId!)) {
        return next(new ErrorHandler("Purchase this asset to download", 403));
      }

      await AssetModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

      res.json({ success: true, fileUrl: asset.fileUrl, fileUrlType: asset.fileUrlType });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const createAssetPaymentOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await AssetModel.findById(id);
      if (!asset || !asset.isPublished) return next(new ErrorHandler("Asset not found", 404));
      if (!asset.isPaid) return next(new ErrorHandler("This asset is free", 400));

      const userId = req.user?._id?.toString();
      if (asset.purchasedUsers.includes(userId!)) {
        return next(new ErrorHandler("You have already purchased this asset", 400));
      }

      const order = await razorpay.orders.create({
        amount: Math.round(asset.price * 100), // paise
        currency: "INR",
        receipt: `asset_${asset._id}_${Date.now()}`,
      });

      res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const purchaseAsset = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return next(new ErrorHandler("Payment verification failed", 400));
      }

      const asset = await AssetModel.findById(id);
      if (!asset) return next(new ErrorHandler("Asset not found", 404));

      const userId = req.user?._id?.toString()!;
      if (!asset.purchasedUsers.includes(userId)) {
        await AssetModel.findByIdAndUpdate(id, { $push: { purchasedUsers: userId } });
      }

      res.json({ success: true, message: "Asset purchased successfully" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
