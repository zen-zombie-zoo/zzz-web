import type { ZombieId } from "./zombies";

export type MachineUpgrade = {
  level: number;
  cost: number;
  unlocks: ZombieId;
  name: string;
};

export const MACHINE_UPGRADES: MachineUpgrade[] = [
  { level: 1, cost: 150, unlocks: "giraffe", name: "Giraffe Habitat" },
  { level: 2, cost: 750, unlocks: "penguin", name: "Penguin Enclosure" },
  { level: 3, cost: 3000, unlocks: "elephant", name: "Elephant Sanctuary" },
  { level: 4, cost: 15000, unlocks: "crocodile", name: "Crocodile Swamp" },
  { level: 5, cost: 75000, unlocks: "gorilla", name: "Gorilla Jungle" },
  { level: 6, cost: 375000, unlocks: "moose", name: "Moose Meadow" },
  { level: 7, cost: 1875000, unlocks: "rhino", name: "Rhino Ranch" },
  { level: 8, cost: 9375000, unlocks: "narwhal", name: "Narwhal Iceberg" },
  { level: 9, cost: 46875000, unlocks: "walrus", name: "Walrus Tundra" },
  { level: 10, cost: 234375000, unlocks: "zebra", name: "Zebra Savanna" },
  { level: 11, cost: 1171875000, unlocks: "whale", name: "Whale Ocean" }
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
