import { useEffect, useState } from "react";
import { calcAll } from "../utils/numerology";
import { generateReading, generateNumerologyImage } from "../utils/gemini";
import "./LoadingScreen.css";

const STEPS = [
  "数字を計算しています...",
  "宇宙の叡智にアクセス中...",
  "あなたの運命を読み解いています...",
  "神秘のカードを描いています...",
  "鑑定結果をまとめています...",
];

export default function LoadingScreen({ formData, onComplete }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stepInterval;
    let cancelled = false;

    async function run() {
      try {
        // ステップ表示を進める
        stepInterval = setInterval(() => {
          setStep((s) => Math.min(s + 1, STEPS.length - 1));
        }, 2000);

        // Gemini APIキーを設定
        const apiKey = formData.apiKey || window.__GEMINI_API_KEY__;
        if (apiKey) {
          // import.meta.envは書き換えられないので、グローバル経由で渡す
          window.__GEMINI_API_KEY__ = apiKey;
        }

        // 数秘術計算
        const numbers = calcAll(formData.name, formData.date);

        // 並列でテキスト生成と画像生成
        const [reading, imageDataUrl] = await Promise.all([
          generateReading(formData.name, formData.date, numbers),
          generateNumerologyImage(formData.name, numbers.lifePath, numbers).catch(
            () => null
          ),
        ]);

        if (!cancelled) {
          clearInterval(stepInterval);
          setStep(STEPS.length - 1);
          onComplete({ numbers, reading, imageDataUrl });
        }
      } catch (err) {
        if (!cancelled) {
          clearInterval(stepInterval);
          setError(err.message || "エラーが発生しました");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
      clearInterval(stepInterval);
    };
  }, []);

  if (error) {
    return (
      <div className="loading-wrapper">
        <div className="card loading-card error-card">
          <div className="error-icon">⚠️</div>
          <h3>エラーが発生しました</h3>
          <p className="error-msg">{error}</p>
          <p className="error-hint">APIキーを確認してページを再読み込みしてください</p>
          <button className="btn-ghost" onClick={() => window.location.reload()}>
            やり直す
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      <div className="card loading-card">
        {/* Animated orb */}
        <div className="loading-orb-container" aria-hidden="true">
          <div className="loading-orb">
            <div className="orb-ring ring-1" />
            <div className="orb-ring ring-2" />
            <div className="orb-ring ring-3" />
            <div className="orb-core">✦</div>
          </div>
        </div>

        <h2 className="loading-title">鑑定中...</h2>

        <div className="loading-steps">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`loading-step ${
                i < step ? "done" : i === step ? "active" : "pending"
              }`}
            >
              <span className="step-dot">
                {i < step ? "✓" : i === step ? "◉" : "○"}
              </span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <p className="loading-note">
          Gemini AIが深く思考しています。少々お待ちください...
        </p>
      </div>
    </div>
  );
}
