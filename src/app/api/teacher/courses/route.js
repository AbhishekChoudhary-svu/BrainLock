import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course.model";

// Create a new course (POST) & Get all courses (GET)
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const course = await Course.create(body);

    return new Response(
      JSON.stringify({ success: true, data: course }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find()
      .populate("instructor", "firstName lastName email")
      .populate("subtopics")
      .populate("studentsEnrolled", "firstName lastName")
      .populate("challenges");

    return new Response(
      JSON.stringify({ success: true, data: courses }),
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
