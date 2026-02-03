import React from "react";
import { Zombies, type ZombieId } from "../game/zombies";
import { useGame } from "../game/useGame";
import { nextUnitCost, totalCostForQuantity } from "../game/economy";

export const ZombieStore: React.FC = () => {
  const { state, buyZombie } = useGame();

  return (
    <div>
      {(Object.keys(Zombies) as ZombieId[]).map(id => {
        const def = Zombies[id];
        const owned = state.generators[id]?.owned ?? 0;
        const cost1 = nextUnitCost(def, owned);
        const cost10 = totalCostForQuantity(def, owned, 10);

        // Unlocking based on cash threshold
        const unlocked = !def.unlockAt || state.gold >= def.unlockAt;

        return (
          <div key={id} className="row" style={{ opacity: unlocked ? 1 : 0.5 }}>
            <div>
              <div>
                <strong>{def.name}</strong> <span className="small">(${def.baseProd}/sec each)</span>
              </div>
              <div className="small">Owned: {owned}</div>
            </div>
            <div>
              <button onClick={() => buyZombie(id, 1)} disabled={state.gold < cost1 || !unlocked}>
                Buy 1 (${Math.floor(cost1)})
              </button>
              <button onClick={() => buyZombie(id, 10)} disabled={state.gold < cost10 || !unlocked}>
                +10 (${Math.floor(cost10)})
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
