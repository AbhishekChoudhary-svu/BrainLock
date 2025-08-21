import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

// DELETE user by ID
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// UPDATE user (role or status)
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();

    // Allow only role or status update
    const allowedUpdates = {};
    if (body.role) allowedUpdates.role = body.role;
    if (body.status) allowedUpdates.status = body.status;

    const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
