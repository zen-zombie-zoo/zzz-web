
import React from 'react';
import { useGame } from '../game/GameContext';
import { Generators, nextUnitCost } from '../game/economy';

export const Store: React.FC = () => {
  const { state, buyGenerator } = useGame();
  const miner = state.generators.miner;

  const cost = nextUnitCost(Generators.miner, miner.owned);
  const canBuy1 = gte(state.gold, cost);

  return (
    <div>
      <h2>Store</h2>
      <div className="row">
        <div>
          <div><strong>Miner</strong></div>
          <div className="small">Owned: {miner.owned}</div>
        </div>
        <div>
          <button onClick={() => buyGenerator('miner', 1)} disabled={!canBuy1}>
            Buy 1 (Cost: {fmt(cost)})
          </button>
        </div>
      </div>

      {/* Optional bulk buys */}
      <div className="row">
        <div className="small">Bulk</div>
        <div>
          <button onClick={() => buyGenerator('miner', 10)}>+10</button>{' '}
          <button onClick={() => buyGenerator('miner', 25)}>+25</button>{' '}
          <button onClick={() => buyGenerator('miner', 100)}>+100</button>
        </div>
      </div>
    </div>
  );
};
