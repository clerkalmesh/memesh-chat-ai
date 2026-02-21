import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key tidak ditemukan' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const tools = [{ googleSearch: {} }];
    const config = {
      thinkingConfig: { thinkingLevel: 'HIGH' },
      tools,
    };
    
    const model = "gemini-3-flash-preview" || 'gemini-2.0-flash'; // Sesuaikan dengan model yang valid

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    // Coba parse JSON dari respons
    let json;
    try {
      json = JSON.parse(fullText);
    } catch {
      // Jika bukan JSON, bungkus dalam format yang diharapkan
      json = { scripts: [{ content: fullText }] };
    }

    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

/*
en
write a two different script for 30 Seconds video on Topic:Cerita Sejarah,

· Give me response in JSON format and follow the schema
  {
  scripts: [
  {
  content: ""
  },
  ]
  }
  
  indonesia
  Buatkan dua naskah video yang berbeda untuk durasi 30 detik dengan topik: Cerita Sejarah. Berikan respons dalam format JSON dengan skema berikut:
{
  scripts: [
    { content: "" },
    { content: "" }
  ]
}

// api/generate-script/route.jsx  
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key tidak ditemukan' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const tools = [{ googleSearch: {} }];
    const config = {
      thinkingConfig: { thinkingLevel: 'HIGH' }, // jika ThinkingLevel tidak tersedia, gunakan string
      tools,
    };
    const model = 'gemini-3-flash-preview'; 

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = '';
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    // Coba parse JSON dari respons
    let json;
    try {
      json = JSON.parse(fullText);
    } catch {
      // Jika bukan JSON, bungkus dalam format yang diharapkan
      json = { scripts: [{ content: fullText }] };
    }

    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
*/