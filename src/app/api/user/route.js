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

async function handler1(req, userId) {
  await dbConnect();

  try {
    if (req.method === "PUT") {
      const body = await req.json();

      
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // 2️⃣ Update only provided fields
      user.firstName = body.firstName ?? user.firstName;
      user.lastName = body.lastName ?? user.lastName;
      user.phoneNumber = body.phoneNumber ?? user.phoneNumber;
      user.email = body.email ?? user.email;
      user.address = body.address ?? user.address;
      user.dateOfBirth = body.dateOfBirth ?? user.dateOfBirth;
      user.department = body.department ?? user.department;
      user.qualifications = body.qualifications ?? user.qualifications;
      user.subjects = body.subjects ?? user.subjects;
      user.bio = body.bio ?? user.bio;

     
      const updatedUser = await user.save();

     
      return new Response(
        JSON.stringify({ success: true, user: updatedUser }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ API error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// 🔒 Protect the route
export const PUT = withAuth(handler1);


