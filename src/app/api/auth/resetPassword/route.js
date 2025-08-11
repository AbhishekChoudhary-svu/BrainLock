import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email or OTP" }),
        { status: 400 }
      );
    }

    // 2. Check OTP & expiry
    if (
      user.resetPasswordOTP !== otp ||
      Date.now() > user.resetPasswordOTPExpire
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired OTP" }),
        { status: 400 }
      );
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password & clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
