import jwt from "jsonwebtoken";

/**
 * Generate an access token for a user
 * @param {string} userId - MongoDB user ID
 * @returns {string} - JWT access token
 */
export function generateAccessToken(userId,role) {
  return jwt.sign(
    { id: userId,role },
    process.env.SECRET_KEY_ACCESS_TOKEN, // should be set in .env.local
    { expiresIn: "7h" }
  );
}
