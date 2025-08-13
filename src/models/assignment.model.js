import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String }, // Optional resource file
    dueDate: { type: Date },
    maxScore: { type: Number, default: 100 },
    subjectChallenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectChallenge",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);
