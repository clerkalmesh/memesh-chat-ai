// app/api/ai/claude/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = "claude-opus-4-6" } =
      await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model,
      max_tokens: 1000,
      messages: [{ role: "user", content: message }],
    });

    const text =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "No response received";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Claude API error:", error);
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : "Failed to get response from Claude";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
