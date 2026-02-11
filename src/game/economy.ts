import { type ZombieId, Zombies } from "./zombies";
import type { GameState } from "./types";
import { getSynergyBonuses } from "./synergy";
import { getActiveBoostMultipliers } from "./boosts";

// Constants
const BASE_ENTRY_FEE = 5;

const VISITOR_ATTRACTION: Record<ZombieId, number> = {
  [Zombies.officerWorker.id]: 0.01,
  [Zombies.teacher.id]: 0.02,
  [Zombies.penguin.id]: 0.03,
  [Zombies.elephant.id]: 0.04,
  [Zombies.crocodile.id]: 0.05,
  [Zombies.gorilla.id]: 0.06,
  [Zombies.moose.id]: 0.07,
  [Zombies.rhino.id]: 0.08,
  [Zombies.narwhal.id]: 0.09,
  [Zombies.walrus.id]: 0.1,
  [Zombies.zebra.id]: 0.11,
  [Zombies.whale.id]: 0.12
};

// Cost calculations
export function totalCostForQuantity(def: { baseCost: number; costGrowth: number }, owned: number, qty: number): number {
  const g = def.costGrowth;
  const base = def.baseCost * Math.pow(g, owned);
  return base * ((Math.pow(g, qty) - 1) / (g - 1));
}

export function nextUnitCost(def: { baseCost: number; costGrowth: number }, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, owned));
}

// Reputation calculations
export function recalcReputation(state: GameState): number {
  const totalVisitors = state.achievements.stats.totalVisitors;
  return Math.min(totalVisitors / 10, 100);
}

// Visitor calculations
export function getEntryFee(reputation: number): number {
  return BASE_ENTRY_FEE * (1 + reputation * 0.005);
}

export function recalcVisitorRate(s: GameState): number {
  let total = 0;
  for (const id of Object.keys(Zombies) as ZombieId[]) {
    const owned = s.generators[id]?.owned ?? 0;
    total += owned * VISITOR_ATTRACTION[id];
  }

  // Apply synergy and boost bonuses
  const synergies = getSynergyBonuses(s);
  const boosts = getActiveBoostMultipliers(s.activeBoosts ?? []);

  return total * s.multipliers.global * synergies.visitorMultiplier * boosts.visitorMultiplier;
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

  // Apply synergy and boost bonuses
  const synergies = getSynergyBonuses(s);
  const boosts = getActiveBoostMultipliers(s.activeBoosts ?? []);

  total *= s.multipliers.global;
  total *= synergies.productionMultiplier * synergies.globalMultiplier;
  total *= boosts.productionMultiplier;

  const visitorRate = recalcVisitorRate(s);
  const reputation = recalcReputation(s);

  return { ...s, brainsPerSecond: total, visitorRate, reputation };
}

export type TickResult = {
  brains: number;
  money: number;
  visitorsSpawned: number;
};

export function applyTick(s: GameState, seconds: number): GameState & { _tickResult: TickResult } {
  const brainsEarned = s.brainsPerSecond * seconds;
  const visitorsSpawned = Math.floor(s.visitorRate * seconds);
  const moneyEarned = visitorsSpawned * getEntryFee(s.reputation);

  return {
    ...s,
    brains: s.brains + brainsEarned,
    money: s.money + moneyEarned,
    _tickResult: {
      brains: brainsEarned,
      money: moneyEarned,
      visitorsSpawned
    }
  };
}
