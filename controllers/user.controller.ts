require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Check if email is valid using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please enter a valid email address", 400));
      }

      // Block temporary/disposable email domains
      const blockedDomains = [
        "mailinator.com",
        "guerrillamail.com",
        "10minutemail.com",
        "temp-mail.org",
        "tempmail.com",
        "throwawaymail.com",
        "maildrop.cc",
        "yopmail.com",
        "fakemailgenerator.com",
        "burnermail.io",
        "spamgourmet.com",
        "getnada.com",
        "sharklasers.com",
        "spam4.me",
        "dispostable.com",
        "tempinbox.com",
        "mohmal.com",
        "tempmail.net",
        "tempmailaddress.com",
        "mytemp.email"
      ];

      const emailDomain = email.split('@')[1].toLowerCase();

      // Check if domain or part of domain matches blocked list
      const isDomainBlocked = blockedDomains.some(blocked =>
        emailDomain === blocked || emailDomain.includes(blocked.replace('.com', ''))
      );

      if (isDomainBlocked) {
        return next(new ErrorHandler("Please use a valid permanent email address. Temporary/disposable emails are not allowed.", 400));
      }

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(process.cwd(), "mails", "activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login for access this resources!", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days

      return next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// social auth
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

// update profile picture
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await userModel.findById(userId).select("+password");

      if (avatar && user) {
        // Check if Cloudinary is properly configured
        if (!process.env.CLOUD_NAME || process.env.CLOUD_NAME === 'Root') {
          return next(new ErrorHandler("Cloudinary is not configured. Please add valid CLOUD_NAME, CLOUD_API_KEY, and CLOUD_SECRET_KEY to .env file. Get free credentials from https://cloudinary.com/users/register/free", 400));
        }

        // if user have one avatar then call this if
        if (user?.avatar?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });
      if (isUserExist) {
        const id = isUserExist._id;
        updateUserRoleService(res, id, role);
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Enroll user in course --- only for admin
export const enrollUserInCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, courseId } = req.body;

      if (!userId || !courseId) {
        return next(new ErrorHandler("User ID and Course ID are required", 400));
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if user already has this course (handle both formats)
      const courseExists = user.courses.some((course: any) => {
        const id = course.courseId || course._id || course;
        return id.toString() === courseId;
      });

      if (courseExists) {
        return next(
          new ErrorHandler("User is already enrolled in this course", 400)
        );
      }

      // Get course details
      const CourseModel = require("../models/course.model").default;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Add course to user's courses array
      user.courses.push({ courseId });
      await user.save();

      // Update Redis cache
      await redis.set(userId, JSON.stringify(user));

      // Send enrollment confirmation email
      const courseUrl = `${process.env.ORIGIN}/course-access/${courseId}`;
      const data = {
        user: { name: user.name },
        course: { name: course.name },
        courseUrl,
      };

      try {
        await sendMail({
          email: user.email,
          subject: `You're Enrolled in ${course.name}!`,
          template: "course-enrollment.ejs",
          data,
        });
      } catch (emailError: any) {
        console.error("Failed to send enrollment email:", emailError.message);
        // Continue even if email fails
      }

      res.status(200).json({
        success: true,
        message: "User enrolled in course successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Create user by admin --- only for admin
export const createUserByAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if email is valid using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please enter a valid email address", 400));
      }

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // Create user directly without activation
      const user = await userModel.create({
        name,
        email,
        password,
        role: role || "user",
        isVerified: true, // Admin-created users are auto-verified
      });

      // Send welcome email with credentials
      const loginUrl = `${process.env.ORIGIN}/profile`;
      const data = {
        user: { name: user.name, email: user.email },
        password: password,
        loginUrl,
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Welcome to BBEdits - Your Account is Ready!",
          template: "welcome-user.ejs",
          data,
        });
      } catch (emailError: any) {
        console.error("Failed to send welcome email:", emailError.message);
        // Continue even if email fails
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Bulk enroll users from CSV/Excel
export const bulkEnrollUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.body;

      if (!req.file) {
        return next(new ErrorHandler("Please upload a file", 400));
      }

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      const CourseModel = require("../models/course.model").default;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const fileBuffer = req.file.buffer;
      const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase();

      let emailsData: { email: string; name?: string }[] = [];

      if (fileExtension === "csv") {
        // Parse CSV
        const csvText = fileBuffer.toString("utf-8");
        const lines = csvText.split("\n").filter(line => line.trim());

        if (lines.length < 2) {
          return next(new ErrorHandler("CSV file is empty or invalid", 400));
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const emailIndex = headers.indexOf("email");
        const nameIndex = headers.indexOf("name");

        if (emailIndex === -1) {
          return next(new ErrorHandler("CSV must contain 'email' column", 400));
        }

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
          if (values[emailIndex]) {
            emailsData.push({
              email: values[emailIndex],
              name: nameIndex !== -1 ? values[nameIndex] : undefined,
            });
          }
        }
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        // Parse Excel
        const XLSX = require("xlsx");
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        emailsData = data.map((row: any) => ({
          email: row.email || row.Email || row.EMAIL,
          name: row.name || row.Name || row.NAME,
        })).filter(item => item.email);
      } else {
        return next(new ErrorHandler("Unsupported file format", 400));
      }

      if (emailsData.length === 0) {
        return next(new ErrorHandler("No valid email addresses found in file", 400));
      }

      let enrolledCount = 0;
      let createdCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // Process each email
      for (const userData of emailsData) {
        try {
          const email = userData.email.toLowerCase().trim();

          // Validate email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.push(`Invalid email: ${email}`);
            continue;
          }

          let user = await userModel.findOne({ email });
          let isNewUser = false;

          // Create user if doesn't exist
          if (!user) {
            // Generate random 8-character password
            const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
            const name = userData.name || email.split("@")[0];

            user = await userModel.create({
              name,
              email,
              password,
              role: "user",
              isVerified: true,
            });

            isNewUser = true;
            createdCount++;

            // Send welcome email with credentials
            const loginUrl = `${process.env.ORIGIN}/profile`;
            const mailData = {
              user: { name: user.name, email: user.email },
              password: password,
              loginUrl,
            };

            try {
              await sendMail({
                email: user.email,
                subject: "Welcome to BBEdits - Your Account is Ready!",
                template: "welcome-user.ejs",
                data: mailData,
              });
            } catch (emailError: any) {
              console.error(`Failed to send welcome email to ${email}:`, emailError.message);
            }
          }

          // Check if already enrolled
          const alreadyEnrolled = user.courses.some((c: any) => {
            const id = c.courseId || c._id || c;
            return id.toString() === courseId;
          });

          if (alreadyEnrolled) {
            skippedCount++;
            continue;
          }

          // Enroll user in course
          user.courses.push({ courseId });
          await user.save();
          await redis.set(user._id.toString(), JSON.stringify(user));

          enrolledCount++;

          // Send enrollment email
          const courseUrl = `${process.env.ORIGIN}/course-access/${courseId}`;
          const enrollData = {
            user: { name: user.name },
            course: { name: course.name },
            courseUrl,
          };

          try {
            await sendMail({
              email: user.email,
              subject: `You've been enrolled in ${course.name}`,
              template: "course-enrollment.ejs",
              data: enrollData,
            });
          } catch (emailError: any) {
            console.error(`Failed to send enrollment email to ${email}:`, emailError.message);
          }

        } catch (error: any) {
          errors.push(`${userData.email}: ${error.message}`);
        }
      }

      res.status(200).json({
        success: true,
        message: `Bulk enrollment completed`,
        enrolled: enrolledCount,
        created: createdCount,
        skipped: skippedCount,
        errors: errors.length > 0 ? errors : undefined,
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
