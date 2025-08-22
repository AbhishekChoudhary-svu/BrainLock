import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    emailVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

    access_token: { type: String, default: null },
    refresh_token: { type: String, default: null },

    enrollmentNumber: { type: String, unique: true, sparse: true },

    // --- COURSES ---
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        completedSubtopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtopic" }],
         completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubjectChallenge" }],
        status: {
          type: String,
          enum: ["active", "inactive", "completed"],
          default: "inactive",
        },
      },
    ],

    // --- CHALLENGES ---
    challenges: [
      {
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubjectChallenge" },
        status: {
          type: String,
          enum: ["active", "completed", "failed"],
          default: "active",
        },
        progress: { type: Number, default: 0 }, // percentage
        score: { type: Number, default: 0 }, // points earned
        attempts: { type: Number, default: 0 },
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date, default: null },
      },
    ],

    points: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    streaks: { type: Number, default: 0 },
    classRank: { type: Number, default: 0 },

    address: { type: String, default: "N/A" },
    dateOfBirth: { type: Date, default: "1990-01-01" },
    department: { type: String, default: "General" },
    bio: { type: String, default: "No bio provided." },
    qualifications: { type: String, default: "" },

    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String },
        badge: { type: String },
        earnedAt: { type: Date, default: Date.now },
        points: { type: Number, default: 0 },
      },
    ],

    progressSummary: {
      percentage: { type: Number, default: 0 },
      completedModules: { type: Number, default: 0 },
      pendingModules: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
