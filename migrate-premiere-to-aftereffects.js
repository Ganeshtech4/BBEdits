"use strict";
require("dotenv").config();
const mongoose = require("mongoose");

// Inline minimal schemas to avoid TS import issues
const courseSchema = new mongoose.Schema({ name: String, purchased: Number }, { strict: false });
const userSchema = new mongoose.Schema({ name: String, email: String, courses: Array }, { strict: false });

const CourseModel = mongoose.models.Course || mongoose.model("Course", courseSchema);
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const migrate = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || "");
    console.log("✅ Connected to database");

    // Find Premiere Pro course
    const premierePro = await CourseModel.findOne({ name: { $regex: /premiere\s*pro/i } });
    if (!premierePro) {
      console.log("❌ 'Premiere Pro' course not found. Available courses:");
      const all = await CourseModel.find({}, "name _id");
      all.forEach((c) => console.log(`  - ${c.name} (${c._id})`));
      process.exit(1);
    }
    console.log(`✅ Premiere Pro: "${premierePro.name}" (${premierePro._id})`);

    // Find After Effects course
    const afterEffects = await CourseModel.findOne({ name: { $regex: /after\s*effects/i } });
    if (!afterEffects) {
      console.log("❌ 'After Effects' course not found. Available courses:");
      const all = await CourseModel.find({}, "name _id");
      all.forEach((c) => console.log(`  - ${c.name} (${c._id})`));
      process.exit(1);
    }
    console.log(`✅ After Effects: "${afterEffects.name}" (${afterEffects._id})`);

    const aeId = afterEffects._id.toString();

    // Find all users enrolled in Premiere Pro
    const enrolledUsers = await UserModel.find({ "courses.courseId": premierePro._id });
    console.log(`\nFound ${enrolledUsers.length} student(s) enrolled in "${premierePro.name}"\n`);

    let addedCount = 0;
    let alreadyCount = 0;

    for (const user of enrolledUsers) {
      const alreadyInAE = user.courses.some((c) => {
        const id = (c.courseId || c._id || c).toString();
        return id === aeId;
      });

      if (alreadyInAE) {
        console.log(`  ⏭️  ${user.name} (${user.email}) — already enrolled in After Effects`);
        alreadyCount++;
      } else {
        user.courses.push({ courseId: afterEffects._id });
        await user.save();
        await CourseModel.findByIdAndUpdate(aeId, { $inc: { purchased: 1 } });
        console.log(`  ✅ Added ${user.name} (${user.email}) to After Effects`);
        addedCount++;
      }
    }

    console.log(`\n--- Migration Complete ---`);
    console.log(`  Added to After Effects : ${addedCount}`);
    console.log(`  Already enrolled       : ${alreadyCount}`);
    console.log(`  Total PP students      : ${enrolledUsers.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
