// File: /app/api/subtopics/route.js
import dbConnect from "@/lib/dbConnect";
import Subtopic from "@/models/subtopic.model";

// CREATE Subtopic
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const newSubtopic = await Subtopic.create(body);

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
export async function GET() {
  try {
    await dbConnect();
    const subtopics = await Subtopic.find()
      .populate("course")
      .populate("contents");

    return new Response(
      JSON.stringify({ success: true, data: subtopics }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
