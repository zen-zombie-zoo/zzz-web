import React from "react";
import { Animals, type AnimalId } from "../game/animals";
import { useGame } from "../game/GameContext";
import { nextUnitCost, totalCostForQuantity } from "../game/economy";

export const AnimalStore: React.FC = () => {
  const { state, buyAnimal } = useGame();

  return (
    <div>
      <h2>Animal Store</h2>
      {(Object.keys(Animals) as AnimalId[]).map(id => {
        const def = Animals[id];
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
              <button onClick={() => buyAnimal(id, 1)} disabled={state.gold < cost1 || !unlocked}>
                Buy 1 (${Math.floor(cost1)})
              </button>
              <button onClick={() => buyAnimal(id, 10)} disabled={state.gold < cost10 || !unlocked}>
                +10 (${Math.floor(cost10)})
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
