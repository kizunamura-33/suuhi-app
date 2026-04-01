import { NUMBER_MEANINGS } from "../utils/numerology";
import "./ResultView.css";

const NUMBER_LABELS = {
  lifePath:    { label: "ライフパス数", icon: "🌟", desc: "人生の使命" },
  expression:  { label: "エクスプレッション数", icon: "💫", desc: "才能と表現" },
  soulUrge:    { label: "ソウルアージ数", icon: "🌙", desc: "魂の望み" },
  personality: { label: "パーソナリティ数", icon: "⭐", desc: "個性の輝き" },
  birthday:    { label: "バースデー数", icon: "✨", desc: "生まれ持った力" },
};

export default function ResultView({ data, onReset }) {
  const { name, date, numbers, reading, imageDataUrl } = data;
  const lifePathMeaning = NUMBER_MEANINGS[numbers.lifePath] || {};

  function handleShare() {
    const text = `【数秘術鑑定結果】\n名前: ${name}\nライフパス数: ${numbers.lifePath} - ${lifePathMeaning.keyword}\n${reading?.overview?.slice(0, 60)}...\n✦ 数秘術鑑定アプリ`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => alert("テキストをコピーしました"));
    }
  }

  return (
    <div className="result-wrapper">
      {/* Hero section */}
      <div className="result-hero card">
        <div className="hero-bg" style={{ background: `radial-gradient(ellipse at center, ${lifePathMeaning.color || "#7c3aed"}22 0%, transparent 70%)` }} />

        <div className="hero-body">
          {imageDataUrl ? (
            <div className="hero-image-wrap">
              <img src={imageDataUrl} alt="数秘術カード" className="hero-image" />
            </div>
          ) : (
            <div className="hero-image-placeholder">
              <span className="hero-number">{numbers.lifePath}</span>
            </div>
          )}

          <div className="hero-info">
            <p className="hero-name">{name} さんの鑑定結果</p>
            <div className="life-path-badge">
              <span className="lp-label">ライフパス数</span>
              <span className="lp-number" style={{ color: lifePathMeaning.color }}>
                {numbers.lifePath}
              </span>
              <span className="lp-keyword">{lifePathMeaning.keyword}</span>
            </div>
            <p className="hero-planet">守護星座: {lifePathMeaning.planet}</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      {reading?.overview && (
        <div className="card reading-section">
          <h3 className="section-title">✦ 総合鑑定</h3>
          <p className="reading-text">{reading.overview}</p>
        </div>
      )}

      {/* Number grid */}
      <div className="numbers-grid">
        {Object.entries(NUMBER_LABELS).map(([key, meta]) => {
          const num = numbers[key];
          const meaning = NUMBER_MEANINGS[num] || {};
          const readingText = reading?.[key];
          return (
            <div key={key} className="number-card card">
              <div className="nc-header">
                <span className="nc-icon">{meta.icon}</span>
                <div>
                  <p className="nc-label">{meta.label}</p>
                  <p className="nc-desc">{meta.desc}</p>
                </div>
                <div
                  className="nc-num"
                  style={{ color: meaning.color, borderColor: meaning.color + "44" }}
                >
                  {num}
                </div>
              </div>
              <p className="nc-keyword" style={{ color: meaning.color }}>
                {meaning.keyword}
              </p>
              <p className="nc-text">{readingText || meaning.essence}</p>
            </div>
          );
        })}
      </div>

      {/* Advice */}
      {reading?.advice && (
        <div className="card reading-section advice-section">
          <h3 className="section-title">✦ 宇宙からのメッセージ</h3>
          <p className="reading-text">{reading.advice}</p>
        </div>
      )}

      {/* Lucky items */}
      {reading?.luckyItems?.length > 0 && (
        <div className="card lucky-section">
          <h3 className="section-title">✦ ラッキーアイテム</h3>
          <div className="lucky-items">
            {reading.luckyItems.map((item, i) => (
              <div key={i} className="lucky-item">
                <span className="lucky-star">★</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="result-actions">
        <button className="btn-primary" onClick={handleShare}>
          <span>📤</span>
          結果をシェア
        </button>
        <button className="btn-ghost" onClick={onReset}>
          ← 最初に戻る
        </button>
      </div>
    </div>
  );
}
