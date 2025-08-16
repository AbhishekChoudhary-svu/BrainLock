import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course.model";
import Subtopic from "@/models/subtopic.model";
import Content from "@/models/content.model";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const course = await Course.findById(params.id)
      // .populate("instructor", "firstName lastName email")
      // .populate("subtopics")
      // .populate("studentsEnrolled", "firstName lastName")
      // .populate("challenges");

    if (!course) {
      return new Response(
        JSON.stringify({ success: false, error: "Course not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: course }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    const course = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return new Response(
        JSON.stringify({ success: false, error: "Course not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: course }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // Find the course first (so we can access subtopics)
    const course = await Course.findById(params.id);
    if (!course) {
      return new Response(
        JSON.stringify({ success: false, error: "Course not found" }),
        { status: 404 }
      );
    }

    // Loop through all subtopics of this course
    if (course.subtopics && course.subtopics.length > 0) {
      for (const subtopicId of course.subtopics) {
        const subtopic = await Subtopic.findById(subtopicId);

        if (subtopic) {
          // Delete all contents under this subtopic
          if (subtopic.contents && subtopic.contents.length > 0) {
            await Content.deleteMany({ _id: { $in: subtopic.contents } });
          }

          // Delete the subtopic itself
          await Subtopic.findByIdAndDelete(subtopicId);
        }
      }
    }

    // Finally delete the course
    await Course.findByIdAndDelete(params.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Course, its subtopics, and contents deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

