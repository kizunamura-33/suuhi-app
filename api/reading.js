import { GoogleGenAI } from "@google/genai";

const THINKING_MODELS = [
  { model: "gemini-2.5-flash", thinking: true },
  { model: "gemini-2.5-pro", thinking: true },
  { model: "gemini-2.0-flash-thinking-exp", thinking: true },
  { model: "gemini-2.0-flash", thinking: false },
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY が設定されていません" });
  }

  const { name, dateStr, numbers } = req.body;
  if (!name || !dateStr || !numbers) {
    return res.status(400).json({ error: "パラメータが不足しています" });
  }

  const ai = new GoogleGenAI({ apiKey });

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

  for (const { model, thinking } of THINKING_MODELS) {
    try {
      const config = thinking
        ? { thinkingConfig: { thinkingBudget: 8000 }, temperature: 1.0 }
        : { temperature: 1.0 };

      const response = await ai.models.generateContent({ model, contents: prompt, config });
      const text = typeof response.text === "function" ? response.text() : response.text;

      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: "レスポンスの解析に失敗しました" });

      return res.status(200).json(JSON.parse(match[0]));
    } catch (e) {
      const isNotFound =
        e?.message?.includes("not found") ||
        e?.message?.includes("NOT_FOUND") ||
        e?.status === 404;
      if (!isNotFound) {
        return res.status(500).json({ error: e.message });
      }
    }
  }

  return res.status(500).json({ error: "利用可能なGeminiモデルが見つかりませんでした" });
}
