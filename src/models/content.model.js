import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, // theory / article text
    videoUrl: { type: String },    // embedded video links (YouTube, etc.)
    fileUrl: { type: String },     // PDFs or other attachments
    duration: { type: Number },    // optional, for video length

    // link content to a specific Subtopic
    subtopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtopic",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Content ||
  mongoose.model("Content", contentSchema);
