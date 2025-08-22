import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import Course from "@/models/course.model";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid, courseid } = params;
  const { subtopicId } = await req.json(); // subtopicId from frontend

  try {
    // 1. Get course with subtopics
    const course = await Course.findById(courseid).populate("subtopics");
    if (!course) {
      return new Response(
        JSON.stringify({ success: false, message: "Course not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Find user
    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Find enrolled course
    const userCourse = user.courses.find(
      (c) => String(c.courseId) === String(courseid)
    );

    if (!userCourse) {
      return new Response(
        JSON.stringify({ success: false, message: "User not enrolled in this course" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Ensure arrays exist
    if (!userCourse.completedSubtopics) userCourse.completedSubtopics = [];

    // 5. Prevent duplicate
    if (userCourse.completedSubtopics.includes(subtopicId)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Subtopic already completed",
          progress: userCourse.progress,
          status: userCourse.status,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 6. Mark subtopic completed
    userCourse.completedSubtopics.push(subtopicId);

    // 7. Calculate subtopic-based progress
    const totalSubtopics = course.subtopics.length || 1;
    const completedSubtopics = userCourse.completedSubtopics.length;

    const subtopicProgress = Math.min((completedSubtopics / totalSubtopics) * 25, 50);

    // Keep challenge progress (if any)
    const challengeProgress = userCourse.progress > 50 ? userCourse.progress - 50 : 0;

    userCourse.progress = Math.min(subtopicProgress + challengeProgress, 100);

    // 8. Update status
    if (userCourse.progress >= 100) {
      userCourse.status = "completed";
    } else if (userCourse.progress >= 50) {
      userCourse.status = "half-completed";
    } else {
      userCourse.status = "active";
    }

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
