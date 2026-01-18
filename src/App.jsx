import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE } from "./colors";
import { playClick, playCorrect, playWrong } from "./sounds";

export default function App() {
  // 使う色セット（初期は3色）
  const [currentColors, setCurrentColors] = useState(PALETTE.slice(0, 3));

  // ダブルタップ防止用のロック
  const lockRef = useRef(false);

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
    setTarget(currentColors[Math.floor(Math.random() * currentColors.length)]);
  }, [currentColors]);

  // タイルの並びはターゲットが変わるたびにシャッフル
  const choices = useMemo(() => {
    // targetを使うことで依存配列の意味を持たせる
    console.log("新しいターゲット:", target.name);
    return [...currentColors].sort(() => Math.random() - 0.5);
  }, [currentColors, target]);

  // 次に狙ってほしい色をランダムに選ぶ
  const nextTarget = () => {
    const n = currentColors[Math.floor(Math.random() * currentColors.length)];
    setTarget(n);
  };

  // Startボタン：状態を初期化 → 新ターゲット
  const onStart = () => {
    setStreak(0);
    setMessage("Tap this color");

    // 色セットを初期化（最初は3色）
    const initial = PALETTE.slice(0, 3);
    setCurrentColors(initial);

    // 初期3色からランダムにターゲットを選ぶ
    const n = initial[Math.floor(Math.random() * initial.length)];
    setTarget(n);
  };

  // 一時的な「色を追加」：PALETTEの先頭から順に、まだ入っていない色を追加（最大6）
  const addColor = () => {
    if (currentColors.length >= 6) return;
    const next = PALETTE.find(c => !currentColors.some(x => x.name === c.name));
    if (next) {
      const updated = [...currentColors, next];
      setCurrentColors(updated);
      setTarget(updated[Math.floor(Math.random() * updated.length)]);
    }
  };

  // 色タップ時の判定
  const onTap = (c) => {
    // ダブルタップ防止：ロック中なら無視
    if (lockRef.current) return;
    lockRef.current = true;

    // タップ時は必ずクリック音を鳴らす
    playClick();

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
        lockRef.current = false;
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
        lockRef.current = false;
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
            onClick={addColor}
            disabled={currentColors.length >= 6}
            title={currentColors.length >= 6 ? "Max 6 colors" : "Add one color"}
          >
            ＋
          </button>
        </div>

        <span className="foot-info">Streak: {streak}</span>
      </footer>
    </main>
  );
}
