import User from "@/models/user.model";

export async function updateDailyStreak(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Get just the YYYY-MM-DD string for today & yesterday
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const lastActiveDate = user.lastActive
    ? new Date(user.lastActive).toISOString().split("T")[0]
    : null;

  if (!lastActiveDate) {
    // first login
    user.streaks = 1;
  } else if (lastActiveDate === today) {
    // already logged in today → do nothing
  } else if (lastActiveDate === yesterday) {
    // continued streak
    user.streaks += 1;
  } else {
    // missed a day, reset streak
    user.streaks = 1;
  }

  // update last active date
  user.lastActive = new Date();

  await user.save();
  return user.streaks;
}
