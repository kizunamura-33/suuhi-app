import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY が設定されていません" });
  }

  const { name, lifePath } = req.body;
  if (!name || !lifePath) {
    return res.status(400).json({ error: "パラメータが不足しています" });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Create a mystical numerology card for ${name}.
Life Path Number is ${lifePath}.
Style: cosmic, mystical, tarot-inspired illustration with deep purple and gold colors,
celestial motifs, sacred geometry, the number ${lifePath} prominently featured,
glowing stars and cosmic energy, ethereal and spiritual atmosphere.
Beautiful, intricate, fantasy art style. No text in the image.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: { responseModalities: ["image"] },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageDataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return res.status(200).json({ imageDataUrl });
      }
    }
    return res.status(500).json({ error: "画像データが見つかりませんでした" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
