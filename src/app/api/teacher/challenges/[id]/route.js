import dbConnect from "@/lib/dbConnect";
import SubjectChallenge from "@/models/subjectChallenge.model";
import MCQ from "@/models/mcq.model";
import Course from "@/models/course.model";

export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const challenge = await SubjectChallenge.findById(id)
      .populate("course", "title")
      // .populate("mcqs")
      // .populate("assignments");

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

export async function PUT(req, context) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = await context.params;

    const challenge = await SubjectChallenge.findByIdAndUpdate(
      id,
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

export async function DELETE(req, context) {
  try {
    await dbConnect();

    // Await params first
    const { params } = context; // Next.js requires you to destructure params
    const challengeId = params.id;

    // Find the challenge
    const challenge = await SubjectChallenge.findById(challengeId);

    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, error: "Challenge not found" }),
        { status: 404 }
      );
    }

    // Delete all MCQs associated with this challenge
    await MCQ.deleteMany({ subjectChallenge: challenge._id });

    // Remove the challenge ID from the associated course
    await Course.findByIdAndUpdate(
      challenge.course,
      { $pull: { challenges: challenge._id } }
    );

    // Delete the challenge itself
    await SubjectChallenge.findByIdAndDelete(challengeId);

    return new Response(
      JSON.stringify({ success: true, message: "Challenge and all its MCQs deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Challenge DELETE error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
