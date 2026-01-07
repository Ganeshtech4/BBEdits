"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
// Send contact form email
exports.sendContactEmail = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        // Validate input
        if (!name || !email || !subject || !message) {
            return next(new ErrorHandler_1.default("Please provide all required fields", 400));
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler_1.default("Please provide a valid email address", 400));
        }
        // Send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_MAIL;
        await (0, sendMail_1.default)({
            email: adminEmail,
            subject: `Contact Form: ${subject}`,
            template: "contact-form.ejs",
            data: {
                name,
                email,
                subject,
                message,
            },
        });
        // Send confirmation email to user
        await (0, sendMail_1.default)({
            email: email,
            subject: "We received your message - BBEdits",
            template: "contact-confirmation.ejs",
            data: {
                name,
            },
        });
        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
