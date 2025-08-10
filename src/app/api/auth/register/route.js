import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/emailService";
import verificationEmailTemplate from "@/utils/verifyEmailTemplete";
import bcrypt from "bcryptjs";

const ADMIN_CODE = process.env.ADMIN_ACTIVATION_CODE;
const TEACHER_CODE = process.env.TEACHER_ACTIVATION_CODE;

export async function POST(req) {
  try {
    await dbConnect();

    const { firstName, lastName, phoneNumber, email, password, adminCode, teacherCode } = await req.json();

   
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Please fill all required fields" }),
        { status: 400 }
      );
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, error: "Email already registered" }),
        { status: 409 }
      );
    }

   
    let role = "student";
    if (adminCode && adminCode === ADMIN_CODE) {
      role = "admin";
    } else if (teacherCode && teacherCode === TEACHER_CODE) {
      role = "teacher";
    }

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires: otpExpiry,
    });

   
    await sendEmail(
      email,
      "Verify Your Email - BrainLock",
      `Your OTP is ${otp}`,
      verificationEmailTemplate(firstName, lastName, otp)
    );

    
    return new Response(
      JSON.stringify({ success: true, message: "Registration successful. Verification email sent." }),
      { status: 201 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
