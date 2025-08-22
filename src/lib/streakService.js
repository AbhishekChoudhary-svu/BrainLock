import User from "@/models/user.model";

export async function updateDailyStreak(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]; // 1 day before

  if (!user.lastActive) {
    user.streaks = 1;
  } else if (user.lastActive === today) {
    // already counted today
  } else if (user.lastActive === yesterday) {
    user.streaks += 1;
  } else {
    user.streaks = 1;
  }

  user.lastActive = today;
  await user.save();

  return user.streaks;
}
