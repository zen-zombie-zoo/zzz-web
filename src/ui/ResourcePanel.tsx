import React from "react";
import { useGame } from "../game/useGame";
import brain from "../assets/brain.svg";

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <div>
      <div className="row">
        <div>Brains:</div>
        <div className="accent">
          {Math.floor(state.gold)} <img src={brain} alt="Brain" width="16" height="16" />
        </div>
      </div>
      <div className="row">
        <div>Production: </div>
        <div className="badge">
          {state.goldPerSecond.toFixed(0)} <img src={brain} alt="Brain" width="16" height="16" /> / sec
        </div>
      </div>
      <div className="row">
        <div>Money:</div>
        <div className="accent">${Math.floor(state.money ?? 0)}</div>
      </div>
      {state.visitorRate > 0 && (
        <div className="row">
          <div>Visitors:</div>
          <div className="badge">{state.visitorRate.toFixed(1)} / sec</div>
        </div>
      )}
    </div>
  );
};
