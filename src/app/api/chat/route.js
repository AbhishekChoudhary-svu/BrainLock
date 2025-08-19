import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in AI chat API:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
