import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/utils/generatedAccessToken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token
      const newAccessToken = generateAccessToken({ id: decoded.id });

      // Optionally set the new access token in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
