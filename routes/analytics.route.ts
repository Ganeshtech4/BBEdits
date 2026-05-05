import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { getCoursesAnalytics, getOrderAnalytics, getUsersAnalytics, getRevenueAnalytics } from "../controllers/analytics.controller";
const analyticsRouter = express.Router();


analyticsRouter.get("/get-users-analytics", isAutheticated,authorizeRoles("admin"), getUsersAnalytics);

analyticsRouter.get("/get-orders-analytics", isAutheticated,authorizeRoles("admin"), getOrderAnalytics);

analyticsRouter.get("/get-courses-analytics", isAutheticated,authorizeRoles("admin"), getCoursesAnalytics);

analyticsRouter.get("/get-revenue-analytics", isAutheticated,authorizeRoles("admin"), getRevenueAnalytics);


export default analyticsRouter;