// File: /app/api/subtopics/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Subtopic from "@/models/subtopic.model";

// GET Subtopic by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const subtopic = await Subtopic.findById(params.id)
      .populate("course")
      .populate("contents");

    if (!subtopic) {
      return new Response(
        JSON.stringify({ success: false, message: "Subtopic not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: subtopic }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// UPDATE Subtopic by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedSubtopic = await Subtopic.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedSubtopic) {
      return new Response(
        JSON.stringify({ success: false, message: "Subtopic not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedSubtopic }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// DELETE Subtopic by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const deletedSubtopic = await Subtopic.findByIdAndDelete(params.id);

    if (!deletedSubtopic) {
      return new Response(
        JSON.stringify({ success: false, message: "Subtopic not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Subtopic deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
