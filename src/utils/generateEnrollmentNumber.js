import User from "@/models/user.model";

export async function generateEnrollmentNumber() {
  const count = await User.countDocuments({ role: "student", enrollmentNumber: { $ne: null } });
  const year = new Date().getFullYear();
  const nextNum = String(count + 1).padStart(4, "0"); // 0001, 0002, etc.
  return `STU-${year}-${nextNum}`;
}
