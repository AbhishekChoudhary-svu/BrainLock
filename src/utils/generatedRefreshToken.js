import jwt from "jsonwebtoken";
import User from "@/models/user.model"; // Adjust path for Next.js

/**
 * Generate and store a refresh token for a user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<string>} - The generated refresh token
 */
export async function generateRefreshToken(userId) {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN, // should be set in .env.local
    { expiresIn: "7d" }
  );

  // Save refresh token in DB
  await User.findByIdAndUpdate(userId, { refresh_token: refreshToken });

  return refreshToken;
}
