import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], required: true },
    action: { type: String, required: true }, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "SubjectChallenge" },
    details: { type: Object }, 
  },
  { timestamps: true }
);

export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySchema);
