import type { GameState } from "./types";

export const SAVE_VERSION = 3;

export const initialState = (): GameState => ({
  version: SAVE_VERSION,
  gold: 100,
  goldPerSecond: 0,
  clickPower: 1,
  generators: {
    monkey: { owned: 0 },
    giraffe: { owned: 0 },
    penguin: { owned: 0 },
    elephant: { owned: 0 }
  },
  multipliers: {
    global: 1,
    perAnimal: {
      monkey: 0.25,
      giraffe: 0.5,
      penguin: 0.75,
      elephant: 1
    }
  },
  lastSavedAt: Date.now(),
  money: 0,
  visitorRate: 0,
  machineLevel: 0
});
