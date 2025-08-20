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
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
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
    

    // Email verification
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

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

     // Auth tokens
    access_token: {
      type: String,
      default: null,
    },
    refresh_token: {
      type: String,
      default: null,
    },

    enrollmentNumber: {
      type: String,
      unique: true,
      sparse: true, // only required for students
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course", // Assuming you have a Course model
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number, // percentage (0–100)
          default: 0,
        },
      },
    ],

    points: {
      type: Number,
      default: 0,
    },
    avgScore: {
      type: Number,
      default: 0,
    },

    // Profile extras
    address: {
      type: String,
      default: "N/A",
    },
    dateOfBirth: {
      type: Date,
      default: "1990-01-01",
    },
    department: {
      type: String,
      default: "General",
    },
    bio: {
      type: String,
      default: "No bio provided.",
    },
    qualifications: {
      type: String,
      default: "",
    },
    subjects: {
      type: [String],
      default: [],
    },

  },
  { timestamps: true }
);

// Avoid recompiling model in dev mode
const User = mongoose.models.Users || mongoose.model("Users", userSchema);

export default User;
 