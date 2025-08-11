import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/emailService"; // your email utility

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // To prevent enumeration attacks
      return new Response(
        JSON.stringify({
          success: true,
          message: "If this email is registered, you will receive an OTP.",
        }),
        { status: 200 }
      );
    }

    // 2. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save OTP in user document with expiry (5 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save({ validateBeforeSave: false });

    // 4. Send OTP to email
    const message = `
      <h2>Password Reset OTP</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      html: message,
    });

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent to email" }),
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
