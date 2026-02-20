// lib/aiServices.ts
import type { AIProvider } from "@/types";

// AI Service Interface
interface AIServiceResponse {
  text: string;
  success: boolean;
  error?: string;
}

export class AIService {
  static async callChatGPT(
    message: string,
    model: string = "gpt-4o-mini" // lebih baru dan murah, gpt-3.5-turbo masih bisa tapi direkomendasikan gpt-4o-mini
  ): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text || "No response received",
        success: true,
      };
    } catch (error) {
      console.error("ChatGPT API error:", error);
      return {
        text: "",
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to get response from ChatGPT",
      };
    }
  }

  static async callClaude(
    message: string,
    model: string = "claude-opus-4-6" // update ke versi terbaru Claude 3.5 Sonnet
  ): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text || "No response received",
        success: true,
      };
    } catch (error) {
      console.error("Claude API error:", error);
      return {
        text: "",
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to get response from Claude",
      };
    }
  }

  static async callGemini(
    message: string,
    model: string = "gemini-3-flash-preview" // model terbaru dan gratis dari Google
  ): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text || "No response received",
        success: true,
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        text: "",
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to get response from Gemini",
      };
    }
  }

  static async callGrok(message: string): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text || "No response received",
        success: true,
      };
    } catch (error) {
      console.error("Grok API error:", error);
      return {
        text: "",
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to get response from Grok",
      };
    }
  }

  static async callDeepSeek(
    message: string,
    model: string = "deepseek-chat" // deepseek-chat = DeepSeek-V3, deepseek-reasoner = DeepSeek-R1
  ): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.text || "No response received",
        success: true,
      };
    } catch (error) {
      console.error("DeepSeek API error:", error);
      return {
        text: "",
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : "Failed to get response from DeepSeek",
      };
    }
  }

  static async callAI(
    message: string,
    provider: AIProvider,
    model?: string
  ): Promise<AIServiceResponse> {
    switch (provider) {
      case "chatgpt":
        return this.callChatGPT(message, model);
      case "claude":
        return this.callClaude(message, model);
      case "gemini":
        return this.callGemini(message, model);
      case "grok":
        return this.callGrok(message);
      case "deepseek":
        return this.callDeepSeek(message, model);
      default:
        return {
          text: "",
          success: false,
          error: "Unsupported AI provider",
        };
    }
  }
}