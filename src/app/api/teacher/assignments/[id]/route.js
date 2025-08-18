import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";

// 📌 Get Assignment by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const assignment = await Assignment.findById(id)
      .populate("subjectChallenge", "title");

    if (!assignment) {
      return new Response(
        JSON.stringify({ success: false, error: "Assignment not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: assignment }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// 📌 Update Assignment
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedAssignment = await Assignment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAssignment) {
      return new Response(
        JSON.stringify({ success: false, error: "Assignment not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedAssignment }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating assignment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// 📌 Delete Assignment
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return new Response(
        JSON.stringify({ success: false, error: "Assignment not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Assignment deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
