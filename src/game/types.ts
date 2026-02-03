import type { ZombieId } from "./zombies";

export interface GameState {
  version: number;
  gold: number;
  goldPerSecond: number;
  clickPower: number;
  generators: Record<ZombieId, { owned: number }>;
  multipliers: {
    global: number;
    perAnimal: Record<ZombieId, number>;
  };
  lastSavedAt: number;
  money: number;
  visitorRate: number;
}
