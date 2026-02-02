import React from 'react';

import {useGame} from "../game/GameContext.tsx";

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <div>
      <h2>Overview</h2>
      <div className="row">
        <div>Cash</div>
        <div className="accent">{state.gold}</div>
      </div>
      <div className="row">
        <div>Revenue</div>
        {/*<div className="badge">${fmt(state.goldPerSecond, 2)} / sec</div>*/}
      </div>
    </div>
  );
};
