// アプリの起点。#root に <App /> を描画する
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css"; // 全体スタイルを読み込む

// index.html の <div id="root"></div> にマウント
createRoot(document.getElementById("root")).render(
  // StrictMode は開発時の潜在バグ検出用（本番では外れる）
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
