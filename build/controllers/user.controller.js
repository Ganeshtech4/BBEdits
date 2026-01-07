"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkEnrollUsers = exports.createUserByAdmin = exports.enrollUserInCourse = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updatePassword = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = void 0;
require("dotenv").config();
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Check if email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler_1.default("Please enter a valid email address", 400));
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
        const isDomainBlocked = blockedDomains.some(blocked => emailDomain === blocked || emailDomain.includes(blocked.replace('.com', '')));
        if (isDomainBlocked) {
            return next(new ErrorHandler_1.default("Please use a valid permanent email address. Temporary/disposable emails are not allowed.", 400));
        }
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exists", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(process.cwd(), "mails", "activation-mail.ejs"), data);
        try {
            await (0, sendMail_1.default)({
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
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode,
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code", 400));
        }
        const { name, email, password } = newUser.user;
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("Email already exist", 400));
        }
        const user = await user_model_1.default.create({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id || "";
        redis_1.redis.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login for access this resources!", 400));
        }
        const user = JSON.parse(session);
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
        return next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// social auth
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = await user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updatePassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password", 400));
        }
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        user.password = newPassword;
        await user.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update profile picture
exports.updateProfilePicture = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId).select("+password");
        if (avatar && user) {
            // Check if Cloudinary is properly configured
            if (!process.env.CLOUD_NAME || process.env.CLOUD_NAME === 'Root') {
                return next(new ErrorHandler_1.default("Cloudinary is not configured. Please add valid CLOUD_NAME, CLOUD_API_KEY, and CLOUD_SECRET_KEY to .env file. Get free credentials from https://cloudinary.com/users/register/free", 400));
            }
            // if user have one avatar then call this if
            if (user?.avatar?.public_id) {
                // first delete the old image
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else {
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
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
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all users --- only for admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user role --- only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            const id = isUserExist._id;
            (0, user_service_1.updateUserRoleService)(res, id, role);
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Delete user --- only for admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        await user.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Enroll user in course --- only for admin
exports.enrollUserInCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            return next(new ErrorHandler_1.default("User ID and Course ID are required", 400));
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        // Check if user already has this course (handle both formats)
        const courseExists = user.courses.some((course) => {
            const id = course.courseId || course._id || course;
            return id.toString() === courseId;
        });
        if (courseExists) {
            return next(new ErrorHandler_1.default("User is already enrolled in this course", 400));
        }
        // Get course details
        const CourseModel = require("../models/course.model").default;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Add course to user's courses array
        user.courses.push({ courseId });
        await user.save();
        // Update Redis cache
        await redis_1.redis.set(userId, JSON.stringify(user));
        // Send enrollment confirmation email
        const courseUrl = `${process.env.ORIGIN}/course-access/${courseId}`;
        const data = {
            user: { name: user.name },
            course: { name: course.name },
            courseUrl,
        };
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: `You're Enrolled in ${course.name}!`,
                template: "course-enrollment.ejs",
                data,
            });
        }
        catch (emailError) {
            console.error("Failed to send enrollment email:", emailError.message);
            // Continue even if email fails
        }
        res.status(200).json({
            success: true,
            message: "User enrolled in course successfully",
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Create user by admin --- only for admin
exports.createUserByAdmin = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler_1.default("Please enter a valid email address", 400));
        }
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exists", 400));
        }
        // Create user directly without activation
        const user = await user_model_1.default.create({
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
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Welcome to BBEdits - Your Account is Ready!",
                template: "welcome-user.ejs",
                data,
            });
        }
        catch (emailError) {
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Bulk enroll users from CSV/Excel
exports.bulkEnrollUsers = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.body;
        if (!req.file) {
            return next(new ErrorHandler_1.default("Please upload a file", 400));
        }
        if (!courseId) {
            return next(new ErrorHandler_1.default("Course ID is required", 400));
        }
        const CourseModel = require("../models/course.model").default;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const fileBuffer = req.file.buffer;
        const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase();
        let emailsData = [];
        if (fileExtension === "csv") {
            // Parse CSV
            const csvText = fileBuffer.toString("utf-8");
            const lines = csvText.split("\n").filter(line => line.trim());
            if (lines.length < 2) {
                return next(new ErrorHandler_1.default("CSV file is empty or invalid", 400));
            }
            const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
            const emailIndex = headers.indexOf("email");
            const nameIndex = headers.indexOf("name");
            if (emailIndex === -1) {
                return next(new ErrorHandler_1.default("CSV must contain 'email' column", 400));
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
        }
        else if (fileExtension === "xlsx" || fileExtension === "xls") {
            // Parse Excel
            const XLSX = require("xlsx");
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            emailsData = data.map((row) => ({
                email: row.email || row.Email || row.EMAIL,
                name: row.name || row.Name || row.NAME,
            })).filter(item => item.email);
        }
        else {
            return next(new ErrorHandler_1.default("Unsupported file format", 400));
        }
        if (emailsData.length === 0) {
            return next(new ErrorHandler_1.default("No valid email addresses found in file", 400));
        }
        let enrolledCount = 0;
        let createdCount = 0;
        let skippedCount = 0;
        const errors = [];
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
                let user = await user_model_1.default.findOne({ email });
                let isNewUser = false;
                // Create user if doesn't exist
                if (!user) {
                    // Generate random 8-character password
                    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
                    const name = userData.name || email.split("@")[0];
                    user = await user_model_1.default.create({
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
                        await (0, sendMail_1.default)({
                            email: user.email,
                            subject: "Welcome to BBEdits - Your Account is Ready!",
                            template: "welcome-user.ejs",
                            data: mailData,
                        });
                    }
                    catch (emailError) {
                        console.error(`Failed to send welcome email to ${email}:`, emailError.message);
                    }
                }
                // Check if already enrolled
                const alreadyEnrolled = user.courses.some((c) => {
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
                await redis_1.redis.set(user._id.toString(), JSON.stringify(user));
                enrolledCount++;
                // Send enrollment email
                const courseUrl = `${process.env.ORIGIN}/course-access/${courseId}`;
                const enrollData = {
                    user: { name: user.name },
                    course: { name: course.name },
                    courseUrl,
                };
                try {
                    await (0, sendMail_1.default)({
                        email: user.email,
                        subject: `You've been enrolled in ${course.name}`,
                        template: "course-enrollment.ejs",
                        data: enrollData,
                    });
                }
                catch (emailError) {
                    console.error(`Failed to send enrollment email to ${email}:`, emailError.message);
                }
            }
            catch (error) {
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
