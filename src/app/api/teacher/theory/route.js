import dbConnect from "@/lib/dbConnect";
import Content from "@/models/content.model";

// CREATE Content
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const newContent = await Content.create(body);

    return new Response(
      JSON.stringify({ success: true, data: newContent }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
    });
  }
}

// GET All Contents
export async function GET() {
  try {
    await dbConnect();
    const contents = await Content.find().populate("subtopic");

    return new Response(
      JSON.stringify({ success: true, data: contents }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
    });
  }
}
