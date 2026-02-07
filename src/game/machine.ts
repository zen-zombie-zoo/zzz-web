import type { ZombieId } from "./zombies";

export type MachineUpgrade = {
  level: number;
  cost: number;
  unlocks: ZombieId;
  name: string;
};

export const MACHINE_UPGRADES: MachineUpgrade[] = [
  { level: 1, cost: 50, unlocks: "giraffe", name: "Giraffe Habitat" },
  { level: 2, cost: 200, unlocks: "penguin", name: "Penguin Enclosure" },
  { level: 3, cost: 500, unlocks: "elephant", name: "Elephant Sanctuary" }
];

export const MAX_MACHINE_LEVEL = MACHINE_UPGRADES.length;

export function getNextUpgrade(currentLevel: number): MachineUpgrade | null {
  return MACHINE_UPGRADES.find(u => u.level === currentLevel + 1) ?? null;
}

export function isZombieUnlocked(zombieId: ZombieId, machineLevel: number): boolean {
  if (zombieId === "monkey") return true; // Always unlocked
  const upgrade = MACHINE_UPGRADES.find(u => u.unlocks === zombieId);
  return upgrade ? machineLevel >= upgrade.level : false;
}
