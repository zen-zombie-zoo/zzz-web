import type { GameState } from "./types";
import { initialAchievementState } from "./achievements";

export const SAVE_VERSION = 4;

export const initialState = (): GameState => ({
  version: SAVE_VERSION,
  brains: 100,
  brainsPerSecond: 0,
  clickPower: 1,
  generators: {
    monkey: { owned: 0 },
    giraffe: { owned: 0 },
    penguin: { owned: 0 },
    elephant: { owned: 0 },
    crocodile: { owned: 0 },
    gorilla: { owned: 0 },
    moose: { owned: 0 },
    rhino: { owned: 0 },
    narwhal: { owned: 0 },
    walrus: { owned: 0 },
    zebra: { owned: 0 },
    whale: { owned: 0 }
  },
  multipliers: {
    global: 1,
    perAnimal: {
      monkey: 0.25,
      giraffe: 0.5,
      penguin: 0.75,
      elephant: 1,
      crocodile: 1.25,
      gorilla: 1.5,
      moose: 1.75,
      rhino: 2,
      narwhal: 2.25,
      walrus: 2.5,
      zebra: 2.75,
      whale: 3
    }
  },
  lastSavedAt: Date.now(),
  money: 0,
  visitorRate: 0,
  machineLevel: 0,
  achievements: initialAchievementState()
});
