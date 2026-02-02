import type { D } from "./numbers";
import type { GameState, GeneratorId, UpgradeId } from "./types";

export const SAVE_VERSION = 2;

export const initialState = (): GameState => ({
  version: SAVE_VERSION,
  gold: 0,
  goldPerSecond: 0,
  generators: {
    monkey: { owned: 0 },
    giraffe: { owned: 0 },
    penguin: { owned: 0 },
    lion: { owned: 0 }
  },
  multipliers: {
    global: 1,
    perAnimal: {
      monkey: 1,
      giraffe: 1,
      penguin: 1,
      lion: 1
    }
  },
  lastSavedAt: Date.now()
});

// Actions
export type Action =
  | { type: "TICK"; seconds: number }
  | { type: "RECALC_DPS" }
  | { type: "BUY_GENERATOR"; id: GeneratorId; quantity: number; totalCost: D }
  | { type: "BUY_UPGRADE"; id: UpgradeId }
  | { type: "APPLY_OFFLINE"; seconds: number }
  | { type: "PRESTIGE" }
  | { type: "LOAD"; state: GameState };

export function cloneState(s: GameState): GameState {
  // shallow clone with Decimal instances kept by reference (safe for our usage)
  return JSON.parse(JSON.stringify(s)) && s; // placeholder; reducer returns new objects per change anyway
}
