// app/api/users/[userid]/courses/[courseid]/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { generateEnrollmentNumber } from "@/utils/generateEnrollmentNumber";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid, courseid } = params; // ✅ lowercase because folder names are lowercase

  try {
    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Assign enrollment number once globally
    if (!user.enrollmentNumber) {
      user.enrollmentNumber = await generateEnrollmentNumber();
    }

    // 🔹 Check if already enrolled
    const courseIndex = user.courses.findIndex(
      (c) => c.courseId.toString() === courseid // ✅ match schema field
    );

    if (courseIndex !== -1) {
      // Update progress
      user.courses[courseIndex].progress = Math.min(
        (user.courses[courseIndex].progress || 0) + 5,
        100
      );
      user.courses[courseIndex].enrolledAt = new Date();
    } else {
      // First time enrollment
      user.courses.push({
        courseId: courseid, 
        progress: 0,
        status: "active",
        enrolledAt: new Date(),
      });
    }

    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        enrollmentNumber: user.enrollmentNumber,
        courses: user.courses,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ API error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
