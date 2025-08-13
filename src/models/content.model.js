import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "article", "quiz", "assignment"],
      default: "article",
    },
    description: { type: String },
    videoUrl: { type: String },
    fileUrl: { type: String },
    duration: { type: Number }, 
  },
  { timestamps: true }
);

export default mongoose.models.Content ||
  mongoose.model("Content", contentSchema);
