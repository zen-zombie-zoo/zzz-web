import type { AnimalId } from "./animals";

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
