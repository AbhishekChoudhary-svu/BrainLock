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
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.SubjectChallenge ||
  mongoose.model("SubjectChallenge", subjectChallengeSchema);
