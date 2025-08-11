// src/app/api/auth/refresh/route.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/utils/generatedAccessToken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST() {
  try {
    await dbConnect();

    // 1. Get refresh token from cookies
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Refresh token missing" }),
        { status: 401 }
      );
    }

    // 2. Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired refresh token" }),
        { status: 403 }
      );
    }

    // 3. Find user from decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }

    // 4. Generate new access token only
    const newAccessToken = generateAccessToken(user._id);

    // 5. Update access token cookie
    cookies().set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    // 6. Send success response
    return new Response(
      JSON.stringify({ success: true, accessToken: newAccessToken }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
