import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/emailService";
import verificationEmailTemplate from "@/utils/verifyEmailTemplete";

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

   
    const user = await User.findOne({ email });
    if (!user) {
     
      return new Response(
        JSON.stringify({
          success: true,
          message: "If this email is registered, you will receive an OTP.",
        }),
        { status: 200 }
      );
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    
    const { firstName, lastName } = user;

    
    await sendEmail(
      email,
      "Verify Your Reset Password - BrainLock",
      `Your OTP is ${otp}`,
      verificationEmailTemplate(firstName, lastName, otp)
    );

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
