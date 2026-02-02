import type {AnimalId} from "./animals.ts";

export type GeneratorId = 'miner';

export interface GeneratorDef {
  id: GeneratorId;
  name: string;
  baseCost: number;        // starting cost
  costGrowth: number; // exponential factor (e.g., 1.15)
  baseProd: number;        // base gold/sec per unit
}

export type UpgradeId = 'double_miner' | 'better_drill';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  desc: string;
  cost: number;
  apply: (s: GameState) => void; // modifies multipliers/flags
}

export interface GeneratorsState {
  [id: string]: { owned: number }; // keyed by AnimalId
}

export interface UpgradesState {
  purchased: Record<UpgradeId, boolean>;
}


export interface GameState {
  version: number;
  gold: number;
  goldPerSecond: number;
  generators: Record<AnimalId, { owned: number }>;
  multipliers: {
    global: number;
    perAnimal: Record<AnimalId, number>;
  };
  lastSavedAt: number;
}

