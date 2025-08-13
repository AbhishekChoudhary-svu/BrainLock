import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    subjectChallenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectChallenge",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MCQ || mongoose.model("MCQ", mcqSchema);
