import { useEffect, useMemo, useState } from "react";
import { PALETTE } from "./colors";
import { playClick, playCorrect, playWrong } from "./sounds";

export default function App() {
  // 今タップしてほしい「正解の色」
  const [target, setTarget] = useState(PALETTE[0]);
  // 画面に出す指示文（英語表示の要件に合わせる）
  const [message, setMessage] = useState("Tap this color");
  // 連続正解カウンタ
  const [streak, setStreak] = useState(0);
  // 視覚フィードバック用（"ok" | "ng" | null）
  const [flash, setFlash] = useState(null);

  // 初期化：最初の色をランダムに
  useEffect(() => {
    setTarget(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
  }, []);

  // タイルの並びはターゲットが変わるたびにシャッフル
  const choices = useMemo(() => {
    // targetを使うことで依存配列の意味を持たせる
    console.log("新しいターゲット:", target.name);
    return [...PALETTE].sort(() => Math.random() - 0.5);
  }, [target]);

  // 次に狙ってほしい色をランダムに選ぶ
  const nextTarget = () => {
    const n = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    setTarget(n);
  };

  // Startボタン：状態を初期化 → 新ターゲット → クリック音
  const onStart = () => {
    setStreak(0);
    setMessage("Tap this color");
    nextTarget();
    playClick();
  };

  // 色タップ時の判定
  const onTap = (c) => {
    if (c.name === target.name) {
      // 正解：緑フラッシュ → メッセージ更新 → ストリーク+1 → 正解音
      setFlash("ok");
      setMessage("Great!");
      setStreak((s) => s + 1);
      playCorrect();

      // 少し待って初期メッセージに戻し、次のターゲットへ
      setTimeout(() => {
        setFlash(null);
        setMessage("Tap this color");
        nextTarget();
      }, 600);
    } else {
      // 不正解：赤フラッシュ → メッセージ更新 → ストリークリセット → エラー音
      setFlash("ng");
      setMessage("Try again");
      setStreak(0);
      playWrong();

      // 少し待って初期メッセージに戻す（ターゲットは据え置き）
      setTimeout(() => {
        setFlash(null);
        setMessage("Tap this color");
      }, 500);
    }
  };

  return (
    // flash の状態に応じて .flash-ok / .flash-ng を付与し、CSSで背景を一瞬変える
    <main className={`app ${flash ? `flash-${flash}` : ""}`}>
      <div className="bg" />

      {/* 上部バー：タイトル + Start */}
      <header className="row">
        <div className="title">color-tap</div>
        <button className="start" onClick={onStart}>Start</button>
      </header>

      {/* 指示カード：メッセージ + ターゲット色名をその色で表示 */}
      <section className="card">
        <p className="hint">{message}</p>
        <p className="target" style={{ color: target.value }}>
          {target.name}
        </p>
      </section>

      {/* 4色の大きいタイル。タップしやすいサイズで2×2配置 */}
      <section className="grid">
        {choices.map((c) => (
          <button
            key={c.name}
            className="color"
            style={{ backgroundColor: c.value }}
            onClick={() => onTap(c)}
            aria-label={`pick ${c.name}`}
          />
        ))}
      </section>

      {/* 最下部：連続正解の表示 */}
      <footer className="foot">
        <div className="left-buttons">
          <button
            type="button"
            className="icon-btn settings-btn"
            aria-label="Open settings"
            onClick={() => console.log("settings clicked")}
          >
            ⚙️
          </button>
          <button
            type="button"
            className="icon-btn add-color-btn"
            aria-label="Add color (temporary)"
            onClick={() => console.log("add color clicked")}
          >
            ＋
          </button>
        </div>

        <span className="foot-info">Streak: {streak}</span>
      </footer>
    </main>
  );
}
