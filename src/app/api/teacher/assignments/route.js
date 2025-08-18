import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";

// 📌 Create Assignment
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const assignment = await Assignment.create(body);

    return new Response(
      JSON.stringify({ success: true, data: assignment }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// 📌 Get All Assignments
export async function GET() {
  try {
    await dbConnect();

    const assignments = await Assignment.find()
      .populate("subjectChallenge", "title");

    return new Response(
      JSON.stringify({ success: true, data: assignments }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
