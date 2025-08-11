import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "@/utils/generatedAccessToken";
import { generateRefreshToken } from "@/utils/generatedRefreshToken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide email, password, and role" }),
        { status: 400 }
      );
    }

    // Find user by email AND role to enforce role-based login
    const user = await User.findOne({ email, role });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email, password, or role" }),
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email, password, or role" }),
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return new Response(
        JSON.stringify({ success: false, error: "Please verify your email before logging in" }),
        { status: 403 }
      );
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    user.refresh_Token = refreshToken;
    await user.save();

    // Store tokens in cookies
    const cookieStore = cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 1 hour
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
