import React from "react";
import { useGame } from "../game/useGame";
import { getNextUpgrade, MAX_MACHINE_LEVEL, isZombieUnlocked } from "../game/machine";
import { Zombies, type ZombieId } from "../game/zombies";
import { nextUnitCost, totalCostForQuantity } from "../game/economy";
import "./MachineModal.css";

export const MachineModal: React.FC = () => {
  const { state, upgradeMachine, buyZombie } = useGame();
  const nextUpgrade = getNextUpgrade(state.machineLevel);
  const isMaxed = state.machineLevel >= MAX_MACHINE_LEVEL;

  return (
    <div>
      {/* Resources */}
      <div className="machine-resources">
        <div>
          <strong>Brains:</strong> {Math.floor(state.gold)}
        </div>
        <div>
          <strong>Coins:</strong> ${state.money}
        </div>
      </div>

      <div className="machine-columns">
        {/* Zombie Store Section */}
        <div className="machine-column">
          <h3 className="machine-section-title">Buy Zombies (Brains)</h3>
          {(Object.keys(Zombies) as ZombieId[])
            .filter(id => isZombieUnlocked(id, state.machineLevel))
            .map(id => {
              const def = Zombies[id];
              const owned = state.generators[id]?.owned ?? 0;
              const cost1 = nextUnitCost(def, owned);
              const cost10 = totalCostForQuantity(def, owned, 10);

              return (
                <div key={id} className="row zombie-item">
                  <div>
                    <div>
                      <strong>{def.name}</strong> <span className="zombie-meta">({def.baseProd}/sec)</span>
                    </div>
                    <div className="zombie-meta">Owned: {owned}</div>
                  </div>
                  <div className="zombie-buttons">
                    <button
                      onClick={() => buyZombie(id, 1)}
                      disabled={state.gold < cost1}
                      className="zombie-buy-button"
                    >
                      +1 ({Math.floor(cost1)})
                    </button>
                    <button
                      onClick={() => buyZombie(id, 10)}
                      disabled={state.gold < cost10}
                      className="zombie-buy-button"
                    >
                      +10 ({Math.floor(cost10)})
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Machine Upgrade Section */}
        <div className="machine-column">
          <h3 className="machine-section-title">
            Upgrade (Coins) - Lv {state.machineLevel}/{MAX_MACHINE_LEVEL}
          </h3>

          {isMaxed ? (
            <div className="upgrade-card-maxed">
              <strong>Fully Upgraded!</strong>
              <div className="upgrade-card-maxed-subtitle">All species unlocked</div>
            </div>
          ) : (
            nextUpgrade && (
              <div className="upgrade-card">
                <div className="upgrade-next-title">
                  <strong>Next: {nextUpgrade.name}</strong>
                </div>
                <div className="upgrade-unlocks">Unlocks: {Zombies[nextUpgrade.unlocks].name}</div>
                <button
                  onClick={upgradeMachine}
                  disabled={state.money < nextUpgrade.cost}
                  className="upgrade-button"
                >
                  Upgrade (${nextUpgrade.cost})
                </button>
                {state.money < nextUpgrade.cost && (
                  <div className="upgrade-need-more">Need ${nextUpgrade.cost - state.money} more</div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
