import dbConnect from "@/lib/dbConnect";
import Content from "@/models/content.model";
import Subtopic from "@/models/subtopic.model";

// GET by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const content = await Content.findById(params.id).populate("subtopic");

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, message: "Content not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: content }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// UPDATE by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await Content.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, message: "Content not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updated }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// DELETE by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // 1. Delete the content
    const deleted = await Content.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, message: "Content not found" }),
        { status: 404 }
      );
    }

    // 2. Remove reference from Subtopic.contents
    if (deleted.subtopic) {
      await Subtopic.findByIdAndUpdate(deleted.subtopic, {
        $pull: { contents: deleted._id },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Content deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
