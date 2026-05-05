"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueAnalytics = exports.getOrderAnalytics = exports.getCoursesAnalytics = exports.getUsersAnalytics = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_Model_1 = __importDefault(require("../models/order.Model"));
// get users analytics --- only for admin
exports.getUsersAnalytics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy } = req.query;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const users = await (0, analytics_generator_1.generateCustomRangeData)(user_model_1.default, start, end, groupBy || 'day');
            return res.status(200).json({
                success: true,
                users: { customRange: users.data },
            });
        }
        const users = await (0, analytics_generator_1.generateLast12MothsData)(user_model_1.default);
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get courses analytics --- only for admin
exports.getCoursesAnalytics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy } = req.query;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const courses = await (0, analytics_generator_1.generateCustomRangeData)(course_model_1.default, start, end, groupBy || 'day');
            return res.status(200).json({
                success: true,
                courses: { customRange: courses.data },
            });
        }
        const courses = await (0, analytics_generator_1.generateLast12MothsData)(course_model_1.default);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get order analytics --- only for admin
exports.getOrderAnalytics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy } = req.query;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const orders = await (0, analytics_generator_1.generateCustomRangeData)(order_Model_1.default, start, end, groupBy || 'day');
            return res.status(200).json({
                success: true,
                orders: {
                    customRange: orders.data,
                    totalRevenue: orders.totalRevenue
                },
            });
        }
        const orders = await (0, analytics_generator_1.generateLast12MothsData)(order_Model_1.default);
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get revenue analytics --- only for admin
exports.getRevenueAnalytics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { period, startDate, endDate, groupBy } = req.query;
        const now = new Date();
        let start;
        let end;
        let effectiveGroupBy = "month";
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            effectiveGroupBy = groupBy || "day";
        }
        else {
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
            if (groupBy)
                effectiveGroupBy = groupBy;
        }
        // Build the $group _id and sort based on effectiveGroupBy
        let groupId;
        let sortStage;
        let labelExpr;
        if (effectiveGroupBy === "month") {
            groupId = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
            sortStage = { "_id.year": 1, "_id.month": 1 };
            labelExpr = { $dateToString: { format: "%b %Y", date: "$createdAt" } };
        }
        else if (effectiveGroupBy === "year") {
            groupId = { year: { $year: "$createdAt" } };
            sortStage = { "_id.year": 1 };
            labelExpr = { $dateToString: { format: "%Y", date: "$createdAt" } };
        }
        else {
            // day
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            };
            sortStage = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
            labelExpr = { $dateToString: { format: "%d %b", date: "$createdAt" } };
        }
        const pipeline = [
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
        const results = await order_Model_1.default.aggregate(pipeline);
        const totalRevenue = results.reduce((sum, r) => sum + (r.revenue || 0), 0);
        const totalOrders = results.reduce((sum, r) => sum + (r.orders || 0), 0);
        res.status(200).json({
            success: true,
            revenue: {
                data: results,
                totalRevenue,
                totalOrders,
                period: period || "custom",
                startDate: start.toISOString(),
                endDate: end.toISOString(),
            },
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
