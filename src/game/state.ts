import type { GameState } from "./types";

export const SAVE_VERSION = 2;

export const initialState = (): GameState => ({
  version: SAVE_VERSION,
  gold: 100,
  goldPerSecond: 0,
  generators: {
    monkey: { owned: 0 },
    giraffe: { owned: 0 },
    penguin: { owned: 0 },
    elephant: { owned: 0 }
  },
  multipliers: {
    global: 1,
    perAnimal: {
      monkey: 1,
      giraffe: 1,
      penguin: 1,
      elephant: 1
    }
  },
  lastSavedAt: Date.now()
});
