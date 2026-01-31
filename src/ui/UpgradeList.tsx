import React from 'react';
import { useGame } from '../game/GameContext';
import { Upgrades } from '../game/upgrades';

export const UpgradeList: React.FC = () => {
  const { state } = useGame();
  const purchased = (state as any).upgrades?.purchased ?? {};

  return (
    <div>
      <h2>Upgrades</h2>
      {Upgrades.map(u => {
        const owned = purchased[u.id] === true;
      // const affordable = state.gold > u.cost;
        return (
          <div key={u.id} className="row">
            <div>
              <div><strong>{u.name}</strong> {owned && <span className="badge">Owned</span>}</div>
              <div className="small">{u.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
