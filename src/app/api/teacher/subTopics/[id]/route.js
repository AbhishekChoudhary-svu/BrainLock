import dbConnect from "@/lib/dbConnect";
import Subtopic from "@/models/subtopic.model";
import Course from "@/models/course.model";
import Content from "@/models/content.model";

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

    // Find subtopic first (so we can access its course & contents)
    const deletedSubtopic = await Subtopic.findById(params.id);
    if (!deletedSubtopic) {
      return new Response(
        JSON.stringify({ success: false, message: "Subtopic not found" }),
        { status: 404 }
      );
    }

    // Delete all contents linked to this subtopic
    if (deletedSubtopic.contents && deletedSubtopic.contents.length > 0) {
      await Content.deleteMany({ _id: { $in: deletedSubtopic.contents } });
    }

    // Remove subtopic from course
    if (deletedSubtopic.course) {
      await Course.findByIdAndUpdate(deletedSubtopic.course, {
        $pull: { subtopics: deletedSubtopic._id },
      });
    }

    // Finally delete the subtopic itself
    await Subtopic.findByIdAndDelete(params.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subtopic and its contents deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}