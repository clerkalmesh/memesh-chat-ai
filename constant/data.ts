import { AIOptions } from "@/types";

export const aiOptions: AIOptions[] = [
  {
    id: "chatgpt",
    name: "gpt-4o-mini",
    icon: "/chatgpt.svg",
    description: "Model GPT-4o mini dari OpenAI: cepat, hemat biaya, cocok untuk menulis, coding, analisis cepat, dan tugas sehari-hari.",
  },
  {
    id: "grok",
    name: "grok-4-latest",
    icon: "/grok.svg",
    description: "Model Grok terbaru dari xAI: akses real-time, gaya respons unik, ideal untuk eksplorasi ide dan informasi terkini.",
  },
  {
    id: "gemini",
    name: "gemini-3-flash-preview",
    icon: "/gemini.svg",
    description: "Model multimodal Google Gemini 3 Flash (preview): cepat, memproses teks, gambar, dan suara, cocok untuk respons instan.",
  },
  {
    id: "claude",
    name: "claude-opus-4-6",
    icon: "/claude.svg",
    description: "Model Claude terbaru dari Anthropic: konteks panjang, keamanan tinggi, ideal untuk percakapan mendalam dan analisis dokumen kompleks.",
  },
  {
    id: "deepseek",
    name: "deepseek-chat",
    icon: "/deepseek.svg",
    description: "Model DeepSeek (V3 & R1): gratis, performa tinggi, unggul dalam coding, penalaran logis, dan analisis teknis.",
  },
];