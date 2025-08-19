import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

// GET /api/users -> Fetch all users
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({}, "-password -access_token -refresh_token").lean();

    return new Response(
      JSON.stringify({ success: true, data: users }),
      { status: 200 }
    );
  } catch (error) {
    console.error(" Error fetching users:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
