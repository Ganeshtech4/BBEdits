"use client";
import React, { useState } from "react";

const TestEmailsPage = () => {
  const [selectedEmail, setSelectedEmail] = useState("activation");

  const emailData = {
    activation: {
      user: { name: "John Doe" },
      activationCode: "123456",
    },
    orderConfirmation: {
      order: {
        _id: "ABC123",
        name: "Complete Web Development Bootcamp",
        price: "4999",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    },
    questionReply: {
      name: "John Doe",
      title: "Introduction to React Hooks - useState and useEffect",
    },
    adminOrder: {
      order: {
        _id: "ABC123",
        name: "Complete Web Development Bootcamp",
        price: "4999",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        studentName: "John Doe",
        studentEmail: "john.doe@example.com",
      },
      adminDashboardUrl: "http://localhost:3000/admin/invoices",
    },
  };

  const renderActivationEmail = () => (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation - BBEdits</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '🎉';
            font-size: 60px;
            display: block;
            margin-bottom: 10px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header p {
            color: rgba(255, 255, 255, 0.95);
            font-size: 16px;
            margin-top: 10px;
        }
        .content {
            padding: 50px 40px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .message {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .code-container {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border: 2px dashed #9ca3af;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 35px 0;
        }
        .code-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        .activation-code {
            font-size: 42px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .timer-info {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .timer-info p {
            color: #92400e;
            font-size: 14px;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .timer-info p::before {
            content: '⏱️';
            font-size: 20px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .copyright {
            color: #9ca3af;
            font-size: 13px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to BBEdits!</h1>
            <p>Your Learning Journey Starts Here</p>
        </div>
        <div class="content">
            <p class="greeting">Hello ${emailData.activation.user.name},</p>
            <p class="message">
                Thank you for joining BBEdits! We're thrilled to have you as part of our learning community. 
                To get started and unlock access to all our courses, please verify your email address.
            </p>
            <div class="code-container">
                <div class="code-label">Your Activation Code</div>
                <div class="activation-code">${emailData.activation.activationCode}</div>
            </div>
            <div class="timer-info">
                <p><strong>Important:</strong> This code will expire in 5 minutes.</p>
            </div>
        </div>
        <div class="footer">
            <div class="copyright">
                © ${new Date().getFullYear()} BBEdits. All rights reserved.<br>
                📍 Vizag, India
            </div>
        </div>
    </div>
</body>
</html>
      `
    }} />
  );

  const renderOrderConfirmation = () => (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 40px 20px;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 50px 40px;
            text-align: center;
        }
        .success-icon {
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin: 0;
        }
        .content {
            padding: 40px;
        }
        .order-details {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .order-info-value {
            color: #1f2937;
            font-size: 16px;
            font-weight: 600;
        }
        .grand-total .total-value {
            color: #059669;
            font-size: 22px;
            font-weight: 800;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="color: #1f2937; font-size: 24px;">Thank You for Your Purchase! 🎉</h2>
            </div>
            <div class="order-details">
                <div style="margin-bottom: 20px;">
                    <div style="color: #6b7280; font-size: 12px; font-weight: 600;">Order Number</div>
                    <div class="order-info-value">#${emailData.orderConfirmation.order._id}</div>
                </div>
                <div>
                    <div style="color: #6b7280; font-size: 12px; font-weight: 600;">Course</div>
                    <div style="color: #667eea; font-weight: 600;">${emailData.orderConfirmation.order.name}</div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #d1d5db;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #1f2937; font-size: 18px; font-weight: 700;">Total Paid:</span>
                        <span class="grand-total"><span class="total-value">₹${emailData.orderConfirmation.order.price}</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
      `
    }} />
  );

  const renderQuestionReply = () => (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 40px 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 50px 40px;
            text-align: center;
        }
        .notification-icon {
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 45px 40px;
        }
        .notification-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid #3b82f6;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
        }
        .video-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="notification-icon">💬</div>
            <h1>You Have a New Reply!</h1>
        </div>
        <div class="content">
            <p style="font-size: 20px; color: #1f2937; font-weight: 600;">Hello ${emailData.questionReply.name},</p>
            <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Great news! Your question has received a new response.
            </p>
            <div class="notification-box">
                <div style="color: #1e40af; font-size: 12px; font-weight: 700; margin-bottom: 12px;">💬 QUESTION IN VIDEO</div>
                <div class="video-title">
                    <span style="color: #4f46e5;">▶️</span> ${emailData.questionReply.title}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
      `
    }} />
  );

  const renderAdminOrder = () => (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
        }
        .student-info {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .price-highlight {
            background-color: #dcfce7;
            color: #166534;
            padding: 8px 15px;
            border-radius: 6px;
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Course Purchase!</h1>
            <p>You have a new student enrollment</p>
        </div>
        <div class="content">
            <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
                <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 500;">💰 A student has successfully purchased a course!</p>
            </div>
            <div class="student-info">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">👤 Student Details</h3>
                <div class="info-row">
                    <span style="color: #6b7280;">Name:</span>
                    <span style="color: #1f2937; font-weight: 600;">${emailData.adminOrder.order.studentName}</span>
                </div>
                <div class="info-row">
                    <span style="color: #6b7280;">Email:</span>
                    <span style="color: #1f2937; font-weight: 600;">${emailData.adminOrder.order.studentEmail}</span>
                </div>
            </div>
            <div style="margin: 25px 0;">
                <div style="margin-bottom: 15px;">
                    <span style="color: #6b7280;">Course Name:</span>
                    <div style="color: #1f2937; font-weight: 600;">${emailData.adminOrder.order.name}</div>
                </div>
                <div>
                    <span style="color: #6b7280;">Amount Paid:</span><br>
                    <span class="price-highlight">₹${emailData.adminOrder.order.price}</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
      `
    }} />
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111827", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}>
          📧 Email Templates Preview
        </h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedEmail("activation")}
            style={{
              padding: "12px 24px",
              backgroundColor: selectedEmail === "activation" ? "#667eea" : "#374151",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
          >
            Activation Email
          </button>
          <button
            onClick={() => setSelectedEmail("orderConfirmation")}
            style={{
              padding: "12px 24px",
              backgroundColor: selectedEmail === "orderConfirmation" ? "#10b981" : "#374151",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
          >
            Order Confirmation
          </button>
          <button
            onClick={() => setSelectedEmail("questionReply")}
            style={{
              padding: "12px 24px",
              backgroundColor: selectedEmail === "questionReply" ? "#4f46e5" : "#374151",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
          >
            Question Reply
          </button>
          <button
            onClick={() => setSelectedEmail("adminOrder")}
            style={{
              padding: "12px 24px",
              backgroundColor: selectedEmail === "adminOrder" ? "#f59e0b" : "#374151",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
          >
            Admin Order
          </button>
        </div>

        <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", padding: "20px", minHeight: "600px" }}>
          {selectedEmail === "activation" && renderActivationEmail()}
          {selectedEmail === "orderConfirmation" && renderOrderConfirmation()}
          {selectedEmail === "questionReply" && renderQuestionReply()}
          {selectedEmail === "adminOrder" && renderAdminOrder()}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Navigate to: <code style={{ backgroundColor: "#374151", padding: "4px 8px", borderRadius: "4px" }}>http://localhost:3000/test-emails</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestEmailsPage;
