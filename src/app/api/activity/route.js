import dbConnect from "@/lib/dbConnect";
import Activity from "@/models/activity.model";
import { withAuth } from "@/middlewares/auth";

async function getAllActivities(req, userId) {
  await dbConnect();

  try {
    const activities = await Activity.find()
      .populate("userId", "firstName lastName role")
      .populate("courseId", "title")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ success: true, data: activities }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

// Protected route
export const GET = withAuth(getAllActivities);
