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
  