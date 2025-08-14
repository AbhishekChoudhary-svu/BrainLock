import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course.model";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const course = await Course.findById(params.id)
      .populate("instructor", "firstName lastName email")
      .populate("subtopics")
      .populate("studentsEnrolled", "firstName lastName")
      .populate("challenges");

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
    const course = await Course.findByIdAndDelete(params.id);

    if (!course) {
      return new Response(
        JSON.stringify({ success: false, error: "Course not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Course deleted successfully" }),
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
