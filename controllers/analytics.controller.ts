import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MothsData, generateCustomRangeData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.Model";

// get users analytics --- only for admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, groupBy } = req.query;

      if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const users = await generateCustomRangeData(
          userModel,
          start,
          end,
          (groupBy as 'day' | 'month' | 'year') || 'day'
        );
        return res.status(200).json({
          success: true,
          users: { customRange: users.data },
        });
      }

      const users = await generateLast12MothsData(userModel);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get courses analytics --- only for admin
export const getCoursesAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { startDate, endDate, groupBy } = req.query;

        if (startDate && endDate) {
          const start = new Date(startDate as string);
          const end = new Date(endDate as string);
          const courses = await generateCustomRangeData(
            CourseModel,
            start,
            end,
            (groupBy as 'day' | 'month' | 'year') || 'day'
          );
          return res.status(200).json({
            success: true,
            courses: { customRange: courses.data },
          });
        }

        const courses = await generateLast12MothsData(CourseModel);
  
        res.status(200).json({
          success: true,
          courses,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );
  
  
// get order analytics --- only for admin
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { startDate, endDate, groupBy } = req.query;

        if (startDate && endDate) {
          const start = new Date(startDate as string);
          const end = new Date(endDate as string);
          const orders = await generateCustomRangeData(
            OrderModel,
            start,
            end,
            (groupBy as 'day' | 'month' | 'year') || 'day'
          );
          return res.status(200).json({
            success: true,
            orders: { 
              customRange: orders.data,
              totalRevenue: orders.totalRevenue 
            },
          });
        }

        const orders = await generateLast12MothsData(OrderModel);
  
        res.status(200).json({
          success: true,
          orders,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

// get revenue analytics --- only for admin
export const getRevenueAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { period, startDate, endDate, groupBy } = req.query;

      const now = new Date();
      let start: Date;
      let end: Date;
      let effectiveGroupBy: "day" | "month" | "year" = "month";

      if (startDate && endDate) {
        start = new Date(startDate as string);
        end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        effectiveGroupBy = (groupBy as any) || "day";
      } else {
        switch (period) {
          case "today":
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            effectiveGroupBy = "day";
            break;
          case "week": {
            const d = new Date(now);
            const dow = d.getDay();
            const diff = dow === 0 ? -6 : 1 - dow;
            start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff, 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            effectiveGroupBy = "day";
            break;
          }
          case "month":
            start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            effectiveGroupBy = "day";
            break;
          case "year":
            start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            effectiveGroupBy = "month";
            break;
          case "last_year":
            start = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
            end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            effectiveGroupBy = "month";
            break;
          default:
            // last 12 months
            start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0, 0);
            end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            effectiveGroupBy = "month";
            break;
        }
        if (groupBy) effectiveGroupBy = groupBy as any;
      }

      // Build the $group _id and sort based on effectiveGroupBy
      let groupId: any;
      let sortStage: any;
      let labelExpr: any;

      if (effectiveGroupBy === "month") {
        groupId = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        sortStage = { "_id.year": 1, "_id.month": 1 };
        labelExpr = { $dateToString: { format: "%b %Y", date: "$createdAt" } };
      } else if (effectiveGroupBy === "year") {
        groupId = { year: { $year: "$createdAt" } };
        sortStage = { "_id.year": 1 };
        labelExpr = { $dateToString: { format: "%Y", date: "$createdAt" } };
      } else {
        // day
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        sortStage = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
        labelExpr = { $dateToString: { format: "%d %b", date: "$createdAt" } };
      }

      const pipeline: any[] = [
        { $match: { createdAt: { $gte: start, $lte: end } } },
        // For orders that already have a stored price (new orders), use it directly.
        // For legacy orders (price field missing/0), fall back to the course price via $lookup.
        {
          $addFields: {
            courseObjId: {
              $convert: { input: "$courseId", to: "objectId", onError: null, onNull: null },
            },
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseObjId",
            foreignField: "_id",
            as: "courseData",
          },
        },
        {
          $addFields: {
            // Prefer the stored order price; if it's missing or 0, fall back to course price
            effectivePrice: {
              $cond: {
                if: { $and: [{ $gt: ["$price", 0] }] },
                then: "$price",
                else: { $ifNull: [{ $arrayElemAt: ["$courseData.price", 0] }, 0] },
              },
            },
          },
        },
        {
          $group: {
            _id: groupId,
            revenue: { $sum: "$effectivePrice" },
            orders: { $sum: 1 },
            label: { $first: labelExpr },
          },
        },
        { $sort: sortStage },
        { $project: { _id: 0, period: "$label", revenue: 1, orders: 1 } },
      ];

      const results = await OrderModel.aggregate(pipeline);

      const totalRevenue = results.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0);
      const totalOrders = results.reduce((sum: number, r: any) => sum + (r.orders || 0), 0);

      res.status(200).json({
        success: true,
        revenue: {
          data: results,
          totalRevenue,
          totalOrders,
          period: period || "custom",
          startDate: start!.toISOString(),
          endDate: end!.toISOString(),
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
  