import dbConnect from "@/lib/dbConnect";
import Subtopic from "@/models/subtopic.model";
import Course from "@/models/course.model";

// CREATE Subtopic
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Create subtopic
    const newSubtopic = await Subtopic.create(body);

    // Add subtopic to its course
    if (body.course) {
      await Course.findByIdAndUpdate(body.course, {
        $addToSet: { subtopics: newSubtopic._id }, // prevent duplicates
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: newSubtopic }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// GET ALL Subtopics
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new Response(
        JSON.stringify({ success: false, error: "Course ID is required" }),
        { status: 400 }
      );
    }

    const subtopics = await Subtopic.find({ course: courseId });

    return new Response(
      JSON.stringify({ success: true, data: subtopics }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

