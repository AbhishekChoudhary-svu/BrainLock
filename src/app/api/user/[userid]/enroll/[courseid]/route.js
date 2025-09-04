// app/api/users/[userid]/courses/[courseid]/route.js
import dbConnect from "@/lib/dbConnect";
import { logActivity } from "@/lib/logActivity";
import User from "@/models/user.model";
import { generateEnrollmentNumber } from "@/utils/generateEnrollmentNumber";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid, courseid } = params; 

  try {
    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    
    if (!user.enrollmentNumber) {
      user.enrollmentNumber = await generateEnrollmentNumber();
    }

    
    const courseIndex = user.courses.findIndex(
      (c) => c.courseId.toString() === courseid
    );

    if (courseIndex !== -1) {
      // Update progress & re-enroll date
      user.courses[courseIndex].progress = Math.min(
        user.courses[courseIndex].progress || 0,
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

    
    await logActivity(user._id, user.role, "ENROLL_COURSE", courseid);

    
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
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
