import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Inisialisasi klien DeepSeek dengan base URL khusus
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1", // endpoint resmi DeepSeek
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = "deepseek-chat" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await deepseek.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: model,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "No response received";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("DeepSeek API error:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { error: errorMessage || "Failed to get response from DeepSeek" },
      { status: 500 }
    );
  }
}