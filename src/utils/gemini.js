// サーバーサイドAPIルート経由でGeminiを呼ぶ（APIキー不要）

export async function generateReading(name, dateStr, numbers) {
  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, dateStr, numbers }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `サーバーエラー (${res.status})`);
  }
  return res.json();
}

export async function generateNumerologyImage(name, lifePath) {
  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, lifePath }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `サーバーエラー (${res.status})`);
  }
  const { imageDataUrl } = await res.json();
  return imageDataUrl;
}
