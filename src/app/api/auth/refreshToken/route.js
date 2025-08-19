// src/app/api/auth/refreshToken/route.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/utils/generatedAccessToken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Refresh token missing" }),
        { status: 401 }
      );
    }

    // 1. Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or expired refresh token" }),
        { status: 403 }
      );
    }

    // 2. Find user and validate refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refresh_Token !== refreshToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid refresh token (mismatch)" }),
        { status: 403 }
      );
    }

    // 3. Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // 4. Update cookie with new access token
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 *  60 * 7, // 7 hours
    });

    // 5. Return response
    return new Response(
      JSON.stringify({ success: true, accessToken: newAccessToken }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
