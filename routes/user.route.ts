import express from "express";
import {
  activateUser,
  bulkEnrollUsers,
  createUserByAdmin,
  deleteUser,
  enrollUserInCourse,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout",isAutheticated, logoutUser);

userRouter.get("/me", isAutheticated, getUserInfo);

userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-user-info",isAutheticated, updateUserInfo);

userRouter.put("/update-user-password", isAutheticated, updatePassword);

userRouter.put("/update-user-avatar", isAutheticated, updateProfilePicture);

userRouter.get(
  "/get-users",
  isAutheticated,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.put(
  "/update-user",
  isAutheticated,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/delete-user/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteUser
);

userRouter.post(
  "/enroll-user",
  isAutheticated,
  authorizeRoles("admin"),
  enrollUserInCourse
);

userRouter.post(
  "/create-user",
  isAutheticated,
  authorizeRoles("admin"),
  createUserByAdmin
);

userRouter.post(
  "/bulk-enroll-users",
  isAutheticated,
  authorizeRoles("admin"),
  upload.single("file"),
  bulkEnrollUsers
);

export default userRouter;
