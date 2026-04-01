import { useState } from "react";
import "./InputForm.css";

export default function InputForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("gemini_api_key") || ""
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("お名前を入力してください"); return; }
    if (!date) { setError("生年月日を入力してください"); return; }
    if (!apiKey.trim()) { setError("Gemini APIキーを入力してください"); return; }

    localStorage.setItem("gemini_api_key", apiKey.trim());

    // env変数として設定（ランタイム）
    window.__GEMINI_API_KEY__ = apiKey.trim();

    onSubmit({ name: name.trim(), date, apiKey: apiKey.trim() });
  }

  return (
    <div className="input-form-wrapper">
      <div className="mystic-orb" aria-hidden="true" />

      <div className="card input-card">
        <div className="form-header">
          <div className="form-icon">🔮</div>
          <h2>あなたの数字を解き明かす</h2>
          <p className="form-subtitle">
            名前と生年月日から、宇宙があなたに与えた使命を読み解きます
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label htmlFor="name">お名前（ローマ字）</label>
            <div className="input-wrapper">
              <span className="input-icon">✨</span>
              <input
                id="name"
                type="text"
                placeholder="例: Yamada Hanako"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>
            <p className="input-hint">数秘術はローマ字の音で計算します</p>
          </div>

          <div className="form-group">
            <label htmlFor="date">生年月日</label>
            <div className="input-wrapper">
              <span className="input-icon">🌙</span>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="apikey">
              Gemini API キー
              <a
                className="api-link"
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
              >
                取得する →
              </a>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="apikey"
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </div>
            <p className="input-hint">キーはブラウザにのみ保存されます</p>
          </div>

          {error && <p className="form-error">⚠ {error}</p>}

          <button type="submit" className="btn-primary submit-btn">
            <span>✦</span>
            鑑定を始める
            <span>✦</span>
          </button>
        </form>
      </div>

      <div className="intro-cards">
        {[
          { icon: "🌟", title: "ライフパス数", desc: "あなたの人生の使命と方向性" },
          { icon: "💫", title: "エクスプレッション数", desc: "あなたの才能と可能性" },
          { icon: "🌙", title: "ソウルアージ数", desc: "あなたの魂の深い望み" },
          { icon: "⭐", title: "パーソナリティ数", desc: "外の世界への見せ方" },
        ].map((item) => (
          <div key={item.title} className="intro-card card">
            <span className="intro-icon">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
