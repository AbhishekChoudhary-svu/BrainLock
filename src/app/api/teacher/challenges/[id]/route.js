import dbConnect from "@/lib/dbConnect";
import SubjectChallenge from "@/models/SubjectChallenge";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const challenge = await SubjectChallenge.findById(params.id)
      .populate("course", "title")
      .populate("mcqs")
      .populate("assignments");

    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, error: "Challenge not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: challenge }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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

    const challenge = await SubjectChallenge.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, error: "Challenge not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: challenge }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const challenge = await SubjectChallenge.findByIdAndDelete(params.id);

    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, error: "Challenge not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Challenge deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
