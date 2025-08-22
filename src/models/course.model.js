import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    published: { type: Boolean, default: false },
    subtopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subtopic",
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    challenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectChallenge",
      },
    ],
    avgScore: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    completion: { type: Number, min: 0, max: 100, default: 0 },
  
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model("Course", courseSchema);
