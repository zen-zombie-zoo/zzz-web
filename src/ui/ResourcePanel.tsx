import React from "react";
import { useGame } from "../game/GameContext";

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <div>
      <div className="row">
        <div>Cash</div>
        <div className="accent">{state.gold}</div>
      </div>
      <div className="row">
        <div>Revenue</div>
        <div className="badge">${state.goldPerSecond} / sec</div>
      </div>
    </div>
  );
};
