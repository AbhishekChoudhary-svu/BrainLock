import Activity from "@/models/activity.model";

export async function logActivity(userId, role, action, courseId, challengeId, details = {}) {
  await Activity.create({
    userId,
    role,
    action,
    courseId,
    challengeId,  // ✅ used here instead of subtopic
    details,
  });
}
