import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import Course from "@/models/course.model";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid, courseid } = params; // ✅ lowercase folder params

  try {
    // 1. Get course and total subtopics
    const course = await Course.findById(courseid).populate("subtopics");
    if (!course) {
      return new Response(
        JSON.stringify({ success: false, message: "Course not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const totalSubtopics = course.subtopics.length;

    // 2. Find user
    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Find enrolled course entry
    const userCourse = user.courses.find(
      (c) => String(c.courseId) === String(courseid)
    );

    if (!userCourse) {
      return new Response(
        JSON.stringify({ success: false, message: "User not enrolled in this course" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Update progress → (completedSubtopics / totalSubtopics) * 100
    userCourse.progress = Math.min(
      userCourse.progress + 50 / totalSubtopics,
      100
    );

    // Update status
    userCourse.status =
      userCourse.progress >= 100 ? "completed" : "active";

    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Progress updated",
        progress: userCourse.progress,
        status: userCourse.status,
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
