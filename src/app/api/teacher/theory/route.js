import dbConnect from "@/lib/dbConnect";
import Content from "@/models/content.model";
import Subtopic from "@/models/subtopic.model";

// CREATE Content
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Create the content
    const newContent = await Content.create(body);

    // 2. Add content reference into Subtopic.contents
    if (body.subtopic) {
      await Subtopic.findByIdAndUpdate(body.subtopic, {
        $addToSet: { contents: newContent._id },
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: newContent }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// GET All Contents (optionally filter by subtopic)
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subtopicId = searchParams.get("subtopic");

    let contents;
    if (subtopicId) {
      // fetch contents by subtopicId
      contents = await Content.find({ subtopic: subtopicId })
        .sort({ createdAt: -1 })
        .populate("subtopic");
    } else {
      // fetch all contents
      contents = await Content.find()
        .sort({ createdAt: -1 })
        .populate("subtopic");
    }

    return new Response(
      JSON.stringify({ success: true, data: contents }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
