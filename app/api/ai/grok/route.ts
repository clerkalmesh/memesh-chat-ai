// app/api/ai/grok/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Note: Grok API is not yet publicly available
    // This is a placeholder implementation
    // You'll need to replace this with actual Grok API calls when available

    if (!process.env.GROK_API_KEY) {
      return NextResponse.json({
        text: "Grok integration is coming soon! The API is not yet publicly available. For now, you can use ChatGPT, Claude, or Gemini.",
      });
    }

    const response = await fetch(
      "https://api.x.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          model: "grok-4-latest",
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response received";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Grok API error:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { error: errorMessage || "Failed to get response from Grok" },
      { status: 500 }
    );
  }
}
