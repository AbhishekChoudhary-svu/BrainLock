import mongoose from "mongoose";

const subjectChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    mcqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MCQ",
      },
    ],

    status: {
      type: String,
      enum: ["pending", "active", "inactive", "completed"],
      default: "inactive",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SubjectChallenge ||
  mongoose.model("SubjectChallenge", subjectChallengeSchema);
