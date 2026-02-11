import type { GameState } from "./types";
import { initialAchievementState } from "./achievements";
import { Zombies } from "./zombies";

export const SAVE_VERSION = 5;

export const initialState = (): GameState => ({
  version: SAVE_VERSION,
  brains: 100,
  brainsPerSecond: 0,
  clickPower: 1,
  generators: {
    [Zombies.officerWorker.id]: { owned: 0 },
    [Zombies.teacher.id]: { owned: 0 },
    [Zombies.penguin.id]: { owned: 0 },
    [Zombies.elephant.id]: { owned: 0 },
    [Zombies.crocodile.id]: { owned: 0 },
    [Zombies.gorilla.id]: { owned: 0 },
    [Zombies.moose.id]: { owned: 0 },
    [Zombies.rhino.id]: { owned: 0 },
    [Zombies.narwhal.id]: { owned: 0 },
    [Zombies.walrus.id]: { owned: 0 },
    [Zombies.zebra.id]: { owned: 0 },
    [Zombies.whale.id]: { owned: 0 }
  },
  multipliers: {
    global: 1,
    perAnimal: {
      [Zombies.officerWorker.id]: 0.25,
      [Zombies.teacher.id]: 0.5,
      [Zombies.penguin.id]: 0.75,
      [Zombies.elephant.id]: 1,
      [Zombies.crocodile.id]: 1.25,
      [Zombies.gorilla.id]: 1.5,
      [Zombies.moose.id]: 1.75,
      [Zombies.rhino.id]: 2,
      [Zombies.narwhal.id]: 2.25,
      [Zombies.walrus.id]: 2.5,
      [Zombies.zebra.id]: 2.75,
      [Zombies.whale.id]: 3
    }
  },
  lastSavedAt: Date.now(),
  money: 0,
  visitorRate: 0,
  machineLevel: 0,
  achievements: initialAchievementState(),
  reputation: 0,
  activeBoosts: []
});
