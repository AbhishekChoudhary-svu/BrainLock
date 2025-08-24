import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function updateAverageCourseProgress(userId) {
  await dbConnect();
  

  // 1. Get user
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 2. Filter only active/completed courses
  const courses =
    user.courses?.filter(
      (c) => c.status === "active" || c.status === "completed"
    ) || [];

  // 3. Calculate average progress
  const averageCourseProgress =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
      : 0;

  // 4. Update DB (update avgScore field)
  user.avgScore = averageCourseProgress;

  await user.save();

  // 5. Return updated avgScore value
  return averageCourseProgress;
}
