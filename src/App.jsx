import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultView from "./components/ResultView";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";

export default function App() {
  const [phase, setPhase] = useState("input");
  const [data, setData] = useState(null);

  function handleSubmit(formData) {
    setData(formData);
    setPhase("loading");
  }

  function handleComplete(result) {
    setData((prev) => ({ ...prev, ...result }));
    setPhase("result");
  }

  function handleReset() {
    setData(null);
    setPhase("input");
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-stars" aria-hidden="true">
          {[...Array(50)].map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                animationDelay: `${(i * 0.17) % 3}s`,
                animationDuration: `${2 + (i % 3)}s`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
              }}
            />
          ))}
        </div>
        <div className="header-content">
          <div className="app-logo">
            <span className="logo-star">✦</span>
            <span>数秘術鑑定</span>
            <span className="logo-star">✦</span>
          </div>
          <p className="app-tagline">宇宙があなたに贈る数字の物語</p>
        </div>
      </header>

      <main className="app-main">
        {phase === "input" && <InputForm onSubmit={handleSubmit} />}
        {phase === "loading" && (
          <LoadingScreen formData={data} onComplete={handleComplete} />
        )}
        {phase === "result" && (
          <ResultView data={data} onReset={handleReset} />
        )}
      </main>

      <footer className="app-footer">
        <p>✦ 数秘術は古来より伝わる宇宙の叡智 ✦</p>
      </footer>
    </div>
  );
}
