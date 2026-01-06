import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/sendMail";

// Send contact form email
export const sendContactEmail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate input
      if (!name || !email || !subject || !message) {
        return next(new ErrorHandler("Please provide all required fields", 400));
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please provide a valid email address", 400));
      }

      // Send email to admin
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_MAIL;
      
      await sendMail({
        email: adminEmail as string,
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
      await sendMail({
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
