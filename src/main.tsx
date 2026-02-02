import React from "react";
import ReactDOM from "react-dom/client";
import { GameProvider } from "./game/GameContext";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);
