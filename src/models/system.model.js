import mongoose from "mongoose";

const SystemStatsSchema = new mongoose.Schema(
  {
    dbOnline: {
      type: Boolean,
      required: true,
    },
    dbHealth: {
      type: String,
      enum: ["Healthy", "Down"],
      required: true,
    },
    dbLoad: {
      type: Number,
      default: 0,
    },
    uptime: {
      type: String, // stored as "3d 5h 12m 10s"
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

export default mongoose.models.SystemStat ||
  mongoose.model("SystemStat", SystemStatsSchema);
