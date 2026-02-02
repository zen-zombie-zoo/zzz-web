import { type ZombieId, Zombies } from "./zombies";
import type { GameState } from "./types";

export function totalCostForQuantity(def: { baseCost: number; costGrowth: number }, owned: number, qty: number): number {
  const g = def.costGrowth;
  const base = def.baseCost * Math.pow(g, owned);

  // geometric series:
  return base * ((Math.pow(g, qty) - 1) / (g - 1));
}

export function nextUnitCost(def: { baseCost: number; costGrowth: number }, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, owned));
}

export function recalcDps(s: GameState): GameState {
  let total = 0;

  for (const id of Object.keys(Zombies) as ZombieId[]) {
    const owned = s.generators[id]?.owned;
    if (owned === 0) continue;

    const def = Zombies[id];
    const base = owned * def.baseProd;
    const withAnimalMult = base * s.multipliers.perAnimal[id];
    total += withAnimalMult;
  }

  total *= s.multipliers.global;

  return { ...s, goldPerSecond: total };
}

export function applyTick(s: GameState, seconds: number): GameState {
  return {
    ...s,
    gold: Math.round(s.gold + s.goldPerSecond * seconds)
  };
}
