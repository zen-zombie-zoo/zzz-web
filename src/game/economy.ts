import type {D} from './numbers';
import {type AnimalId, Animals} from './animals';
import type {GameState, GeneratorDef} from './types';

export const Generators: Record<'miner', GeneratorDef> = {
  miner: {
    id: 'miner',
    name: 'Miner',
    baseCost:10,
    costGrowth: 1.15,
    baseProd: 1, // 1 gold/sec per miner (before multipliers)
  },
};

// Geometric series cost for buying `n` units at once

export function totalCostForQuantity(def, owned: number, qty: number): number {
  const g = def.costGrowth;
  const base = def.baseCost * Math.pow(g, owned);

  // geometric series:
  return base * ((Math.pow(g, qty) - 1) / (g - 1));
}

export function nextUnitCost(def, owned: number): number {
  return def.baseCost * Math.pow(def.costGrowth, owned);
}

export function recalcDps(s: GameState): GameState {
  let total = 0;

  for (const id of Object.keys(Animals) as AnimalId[]) {
    const owned = s.generators[id].owned;
    if (owned === 0) continue;

    const def = Animals[id];
    const base = owned * def.baseProd;
    const withAnimalMult = base * s.multipliers.perAnimal[id];
    total += withAnimalMult;
  }

  total *= s.multipliers.global * s.multipliers.prestige;

  return { ...s, goldPerSecond: total };
}

export function canSeeAnimal(id: AnimalId, cash: D): boolean {
  const threshold = Animals[id].unlockAt;
  if (!threshold) return true;
  // simple comparison: show if player has reached threshold at least once
  // (you could track "maxCashEver" for a better UX; keeping simple here)
  return cash.greaterThanOrEqualTo(threshold);
}

export function applyTick(s: GameState, seconds: number): GameState {
  return {
    ...s,
    gold: s.gold + s.goldPerSecond * seconds,
  };
}
