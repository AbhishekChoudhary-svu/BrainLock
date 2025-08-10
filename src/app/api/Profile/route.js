import auth from "@/middlewares/auth";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";

async function handler(req, res) {
  await connectDB();

  try {
    const user = await User.findById(req.userId).select("-password"); // remove password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export default auth(handler); // Protect the route
