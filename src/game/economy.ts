import { type ZombieId, Zombies } from "./zombies";
import type { GameState } from "./types";

// Constants
const BASE_ENTRY_FEE = 5;

const VISITOR_ATTRACTION: Record<ZombieId, number> = {
  monkey: 0.01,
  giraffe: 0.02,
  penguin: 0.03,
  elephant: 0.04,
  crocodile: 0.05,
  gorilla: 0.06,
  moose: 0.07,
  rhino: 0.08,
  narwhal: 0.09,
  walrus: 0.1,
  zebra: 0.11,
  whale: 0.12
};

// Cost calculations
export function totalCostForQuantity(
  def: { baseCost: number; costGrowth: number },
  owned: number,
  qty: number
): number {
  const g = def.costGrowth;
  const base = def.baseCost * Math.pow(g, owned);
  return base * ((Math.pow(g, qty) - 1) / (g - 1));
}

export function nextUnitCost(
  def: { baseCost: number; costGrowth: number },
  owned: number
): number {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, owned));
}

// Visitor calculations
export function getEntryFee(): number {
  return BASE_ENTRY_FEE;
}

export function recalcVisitorRate(s: GameState): number {
  let total = 0;
  for (const id of Object.keys(Zombies) as ZombieId[]) {
    const owned = s.generators[id]?.owned ?? 0;
    total += owned * VISITOR_ATTRACTION[id];
  }
  return total * s.multipliers.global;
}

// State updates
export function recalcDps(s: GameState): GameState {
  let total = 0;

  for (const id of Object.keys(Zombies) as ZombieId[]) {
    const owned = s.generators[id]?.owned;
    if (owned === 0) continue;

    const def = Zombies[id];
    const base = owned * def.baseProd;
    total += base * s.multipliers.perAnimal[id];
  }

  total *= s.multipliers.global;

  const visitorRate = recalcVisitorRate(s);

  return { ...s, brainsPerSecond: total, visitorRate };
}

export function applyTick(s: GameState, seconds: number): GameState {
  return {
    ...s,
    brains: s.brains + s.brainsPerSecond * seconds
  };
}
