// ピタゴラス数秘術の文字数値マッピング
const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// 数字を1桁になるまで足し合わせる（11, 22, 33はマスターナンバーとして残す）
export function reduceToSingle(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d), 0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

// 誕生日から運命数（ライフパスナンバー）を計算
export function calcLifePath(dateStr) {
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingle(sum);
}

// 名前から表現数（エクスプレッションナンバー）を計算
export function calcExpression(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = letters.split('').reduce((s, ch) => s + (LETTER_VALUES[ch] || 0), 0);
  return reduceToSingle(sum);
}

// 母音から魂の衝動数（ソウルアージナンバー）を計算
export function calcSoulUrge(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = letters.split('').reduce((s, ch) => s + (VOWELS.has(ch) ? (LETTER_VALUES[ch] || 0) : 0), 0);
  return reduceToSingle(sum);
}

// 子音から個性数（パーソナリティナンバー）を計算
export function calcPersonality(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = letters.split('').reduce((s, ch) => s + (!VOWELS.has(ch) ? (LETTER_VALUES[ch] || 0) : 0), 0);
  return reduceToSingle(sum);
}

// 誕生日数
export function calcBirthday(dateStr) {
  const day = parseInt(dateStr.split('-')[2]);
  return reduceToSingle(day);
}

export function calcAll(name, dateStr) {
  return {
    lifePath: calcLifePath(dateStr),
    expression: calcExpression(name),
    soulUrge: calcSoulUrge(name),
    personality: calcPersonality(name),
    birthday: calcBirthday(dateStr),
  };
}

// 各数字の意味
export const NUMBER_MEANINGS = {
  1: { keyword: '独立・先駆者', essence: 'リーダーシップと独創性の数。新しい道を切り拓く力を持ちます。', color: '#FF6B6B', planet: '太陽' },
  2: { keyword: '調和・協力', essence: '調和と協力の数。繊細な感受性と外交的な才能があります。', color: '#A8E6CF', planet: '月' },
  3: { keyword: '創造・表現', essence: '創造性と表現の数。芸術的才能とコミュニケーション力に恵まれています。', color: '#FFD93D', planet: '木星' },
  4: { keyword: '安定・実務', essence: '安定と実務の数。堅実さと誠実さで基盤を築く力があります。', color: '#6BCF63', planet: '土星' },
  5: { keyword: '自由・変化', essence: '自由と変化の数。冒険心と適応力で多様な経験を積みます。', color: '#45B7D1', planet: '水星' },
  6: { keyword: '愛・責任', essence: '愛と責任の数。思いやりと奉仕の精神で周りを幸せにします。', color: '#FF8B94', planet: '金星' },
  7: { keyword: '探求・神秘', essence: '探求と神秘の数。深い知性と霊的な洞察力を持ちます。', color: '#7B68EE', planet: '海王星' },
  8: { keyword: '成功・権力', essence: '成功と権力の数。物質的な達成と強い意志力があります。', color: '#DDA0DD', planet: '土星' },
  9: { keyword: '完成・博愛', essence: '完成と博愛の数。人類への奉仕と高い精神性を持ちます。', color: '#F0A500', planet: '火星' },
  11: { keyword: 'マスター直感', essence: 'マスターナンバー11。高度な直感と霊的啓発をもたらす特別な数です。', color: '#E0BBE4', planet: '月・太陽' },
  22: { keyword: 'マスター建設者', essence: 'マスターナンバー22。大きなビジョンを現実に変える力を持つ数です。', color: '#957DAD', planet: '土星・地球' },
  33: { keyword: 'マスター教師', essence: 'マスターナンバー33。愛と奉仕を通じて世界を変える使命の数です。', color: '#D291BC', planet: '金星・木星' },
};
