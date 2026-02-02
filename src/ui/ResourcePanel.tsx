import React from "react";
import { useGame } from "../game/GameContext";
import brain from "../assets/brain.svg";

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <div>
      <div className="row">
        <div>Brains:</div>
        <div className="accent">{Math.floor(state.gold)} <img src={brain} alt="Brain" width="16" height="16" /></div>
      </div>
      <div className="row">
        <div>Production: </div>
        <div className="badge">{state.goldPerSecond.toFixed(0)} <img src={brain} alt="Brain" width="16" height="16" /> / sec</div>
      </div>
    </div>
  );
};
