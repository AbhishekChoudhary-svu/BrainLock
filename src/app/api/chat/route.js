import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const result =  streamText({
      model: groq("llama-3.3-70b-versatile"), 
      messages,
    });


    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in AI chat API:", error);

    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
