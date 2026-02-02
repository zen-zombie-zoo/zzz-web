import React from "react";
import { useGame } from "../game/GameContext";

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <div>
      <div className="row">
        <div>Cash</div>
        <div className="accent">${Math.floor(state.gold)}</div>
      </div>
      <div className="row">
        <div>Revenue</div>
        <div className="badge">${state.goldPerSecond.toFixed(1)} / sec</div>
      </div>
    </div>
  );
};
