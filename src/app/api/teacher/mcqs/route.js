import dbConnect from "@/lib/dbConnect";
import MCQ from "@/models/mcq.model";
import SubjectChallenge from "@/models/subjectChallenge.model";


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { question, options, subjectChallenge } = body;

    if (!question || !options || !subjectChallenge) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Question, options, and subjectChallenge are required",
        }),
        { status: 400 }
      );
    }

    // Create the MCQ
    const mcq = await MCQ.create({
      question,
      options,
      subjectChallenge,
    });

    // Add MCQ reference to SubjectChallenge
    await SubjectChallenge.findByIdAndUpdate(
      subjectChallenge,
      { $push: { mcqs: mcq._id } },
      { new: true, runValidators: true }
    );

    return new Response(
      JSON.stringify({ success: true, data: mcq }),
      { status: 201 }
    );
  } catch (error) {
    console.error("MCQ POST error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return new Response(
        JSON.stringify({ success: false, error: "Challenge ID is required" }),
        { status: 400 }
      );
    }

    // Fetch MCQs for this challenge
    const mcqs = await MCQ.find({ subjectChallenge: challengeId })
      .populate("subjectChallenge", "title");

    return new Response(
      JSON.stringify({ success: true, data: mcqs }),
      { status: 200 }
    );
  } catch (error) {
    console.error("MCQ GET error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
