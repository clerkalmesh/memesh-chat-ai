// app/api/ai/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });

    const text = response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : "Failed to get response from Gemini";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
