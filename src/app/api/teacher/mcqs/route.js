import dbConnect from "@/lib/dbConnect";
import MCQ from "@/models/MCQ";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { question, options, subjectChallenge } = body;

    if (!question || !options || !subjectChallenge) {
      return new Response(
        JSON.stringify({ success: false, error: "Question, options, and subjectChallenge are required" }),
        { status: 400 }
      );
    }

    const mcq = await MCQ.create({
      question,
      options,
      subjectChallenge,
    });

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

export async function GET() {
  try {
    await dbConnect();
    const mcqs = await MCQ.find().populate("subjectChallenge", "title");

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
