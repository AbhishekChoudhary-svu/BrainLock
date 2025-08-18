import dbConnect from "@/lib/dbConnect";
import MCQ from "@/models/MCQ";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const mcq = await MCQ.findById(params.id).populate("subjectChallenge", "title");

    if (!mcq) {
      return new Response(
        JSON.stringify({ success: false, error: "MCQ not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: mcq }),
      { status: 200 }
    );
  } catch (error) {
    console.error("MCQ GET by ID error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    const mcq = await MCQ.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!mcq) {
      return new Response(
        JSON.stringify({ success: false, error: "MCQ not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: mcq }),
      { status: 200 }
    );
  } catch (error) {
    console.error("MCQ PUT error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const mcq = await MCQ.findByIdAndDelete(params.id);

    if (!mcq) {
      return new Response(
        JSON.stringify({ success: false, error: "MCQ not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "MCQ deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("MCQ DELETE error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
