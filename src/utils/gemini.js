import { GoogleGenAI } from "@google/genai";

function getClient() {
  const apiKey =
    window.__GEMINI_API_KEY__ ||
    import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini APIキーが設定されていません");
  return new GoogleGenAI({ apiKey });
}

// Gemini 2.5 Flash thinking mode で数秘術の鑑定文を生成
export async function generateReading(name, dateStr, numbers) {
  const ai = getClient();

  const prompt = `あなたは数秘術の専門家です。以下の情報を元に、日本語で詳細な数秘術鑑定を行ってください。

【鑑定対象者】
名前: ${name}
生年月日: ${dateStr}

【計算された数字】
- ライフパスナンバー（運命数）: ${numbers.lifePath}
- エクスプレッションナンバー（表現数）: ${numbers.expression}
- ソウルアージナンバー（魂の衝動数）: ${numbers.soulUrge}
- パーソナリティナンバー（個性数）: ${numbers.personality}
- バースデーナンバー（誕生日数）: ${numbers.birthday}

以下の構成でJSONを返してください（余計な説明は不要、JSONのみ）:
{
  "overview": "全体的な総評（200字程度）",
  "lifePath": "ライフパスナンバーの詳細解説（150字程度）",
  "expression": "エクスプレッションナンバーの詳細解説（150字程度）",
  "soulUrge": "ソウルアージナンバーの詳細解説（150字程度）",
  "personality": "パーソナリティナンバーの詳細解説（150字程度）",
  "advice": "今後のアドバイスとメッセージ（200字程度）",
  "luckyItems": ["ラッキーアイテム1", "ラッキーアイテム2", "ラッキーアイテム3"]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 8000 },
      temperature: 1.0,
    },
  });

  const text = response.text();
  // JSON部分を抽出
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("レスポンスの解析に失敗しました");
  return JSON.parse(match[0]);
}

// Gemini 2.0 Flash 画像生成 で数秘術カードを生成
export async function generateNumerologyImage(name, lifePath, numbers) {
  const ai = getClient();

  const prompt = `Create a mystical numerology card for ${name}.
Life Path Number is ${lifePath}.
Style: cosmic, mystical, tarot-inspired illustration with deep purple and gold colors,
celestial motifs, sacred geometry, the number ${lifePath} prominently featured,
glowing stars and cosmic energy, ethereal and spiritual atmosphere.
Beautiful, intricate, fantasy art style. No text in the image.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: prompt,
    config: {
      responseModalities: ["image"],
    },
  });

  // 画像データを取得
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("画像の生成に失敗しました");
}
