import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4o"), // Using GPT-4o model
      messages,
    })

    return result.to
  } catch (error) {
    console.error("Error in AI chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
