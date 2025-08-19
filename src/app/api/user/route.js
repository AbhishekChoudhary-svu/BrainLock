import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { withAuth } from "@/middlewares/auth";

async function handler(req, userId) {
  await dbConnect();

  try {
    const user = await User.findById(userId).select("-password" );
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user:user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = withAuth(handler);
