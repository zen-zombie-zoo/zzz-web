import type { ZombieId } from "./zombies";
import type { AchievementState } from "./achievements";
import type { ActiveBoost } from "./boosts";

export interface GameState {
  version: number;
  brains: number;
  brainsPerSecond: number;
  clickPower: number;
  generators: Record<ZombieId, { owned: number }>;
  multipliers: {
    global: number;
    perAnimal: Record<ZombieId, number>;
  };
  lastSavedAt: number;
  money: number;
  visitorRate: number;
  machineLevel: number;
  achievements: AchievementState;
  reputation: number;
  activeBoosts: ActiveBoost[];
}
