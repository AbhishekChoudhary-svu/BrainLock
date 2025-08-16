import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    description: { type: String }, // for theory / article text
    videoUrl: { type: String },    // for embedded video links (YouTube, etc.)
    fileUrl: { type: String },     // for PDFs or other attachments
    duration: { type: Number },    // optional, for video length
  },
  { timestamps: true }
);

export default mongoose.models.Content ||
  mongoose.model("Content", contentSchema);
