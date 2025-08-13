import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Subtopic ||
  mongoose.model("Subtopic", subtopicSchema);
