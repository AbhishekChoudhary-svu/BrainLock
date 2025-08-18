import dbConnect from "@/lib/dbConnect";
import SubjectChallenge from "@/models/SubjectChallenge";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, course, status, difficulty } = body;

    if (!title || !course) {
      return new Response(
        JSON.stringify({ success: false, error: "Title and Course are required" }),
        { status: 400 }
      );
    }

    const challenge = await SubjectChallenge.create({
      title,
      description,
      course,
      status: status || "inactive",
      difficulty: difficulty || "medium",
    });

    return new Response(
      JSON.stringify({ success: true, data: challenge }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const challenges = await SubjectChallenge.find()
      .populate("course", "title")
      .populate("mcqs")
      .populate("assignments");

    return new Response(
      JSON.stringify({ success: true, data: challenges }),
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
