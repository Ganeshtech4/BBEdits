require("dotenv").config();
import mongoose from "mongoose";
import userModel from "./models/user.model";

const makeAdmin = async (email: string) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL || "");
    console.log("Connected to database");

    // Find user and update role
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`✅ User ${email} is now an admin!`);
      console.log(`User details:`, {
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      console.log(`❌ User with email ${email} not found`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

// Get email from command line argument or use default
const email = process.argv[2] || "darksoulyt34@gmail.com";
makeAdmin(email);
