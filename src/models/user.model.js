// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    institutionName: {
      type: String,
      required: [true, "Please enter your institution/school name"],
    },

    // Common Auth Fields
    password: {
      type: String,
      required: [true, "Please create a password"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // Student-specific field
    gradeLevel: {
      type: String, // For Students only
      default: null,
    },

    // Teacher-specific fields
    subject: {
      type: String, // For Teachers only
      default: null,
    },
    about: {
      type: String, // For Teachers & Admins
      default: "",
    },

    // Admin-specific field
    department: {
      type: String, // For Admins only
      default: null,
    },

    // Security & Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },

    // Tokens
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
