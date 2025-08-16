// public/ 配下の音声ファイルを再生する小さなヘルパー。
// cloneNode(true) で毎回インスタンスを複製 → 連打しても途切れにくい。
const make = (path) => {
  const a = new Audio(path);
  a.preload = "auto";
  return () => {
    const x = a.cloneNode(true);
    // 一部ブラウザはユーザー操作後でないと再生不可。Startボタン経由ならOKになりやすい。
    x.play().catch(() => {});
  };
};

// それぞれ /public のファイルを指定
export const playClick = make("/sfx_click.mp3"); // 決定ボタン音
export const playCorrect = make("/sfx_correct.mp3"); // 成功音
export const playWrong = make("/sfx_wrong.mp3");  // 警告音

// 音がまだ無いときは、上3つを全部 `() => {}` にしておけば無音で動作します。