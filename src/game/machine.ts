import { Zombies, type ZombieId } from "./zombies";

export type MachineUpgrade = {
  level: number;
  cost: number;
  unlocks: ZombieId;
  name: string;
};

export const MACHINE_UPGRADES: MachineUpgrade[] = [
  { level: 1, cost: 150, unlocks: Zombies.teacher.id, name: "Teacher Habitat" },
  { level: 2, cost: 750, unlocks: Zombies.penguin.id, name: "Penguin Enclosure" },
  { level: 3, cost: 3000, unlocks: Zombies.elephant.id, name: "Elephant Sanctuary" },
  { level: 4, cost: 15000, unlocks: Zombies.crocodile.id, name: "Crocodile Swamp" },
  { level: 5, cost: 75000, unlocks: Zombies.gorilla.id, name: "Gorilla Jungle" },
  { level: 6, cost: 375000, unlocks: Zombies.moose.id, name: "Moose Meadow" },
  { level: 7, cost: 1875000, unlocks: Zombies.rhino.id, name: "Rhino Ranch" },
  { level: 8, cost: 9375000, unlocks: Zombies.narwhal.id, name: "Narwhal Iceberg" },
  { level: 9, cost: 46875000, unlocks: Zombies.walrus.id, name: "Walrus Tundra" },
  { level: 10, cost: 234375000, unlocks: Zombies.zebra.id, name: "Zebra Savanna" },
  { level: 11, cost: 1171875000, unlocks: Zombies.whale.id, name: "Whale Ocean" }
];

export const MAX_MACHINE_LEVEL = MACHINE_UPGRADES.length;

export function getNextUpgrade(currentLevel: number): MachineUpgrade | null {
  return MACHINE_UPGRADES.find(u => u.level === currentLevel + 1) ?? null;
}

export function isZombieUnlocked(zombieId: ZombieId, machineLevel: number): boolean {
  if (zombieId === Zombies.officerWorker.id) return true; // Always unlocked
  const upgrade = MACHINE_UPGRADES.find(u => u.unlocks === zombieId);
  return upgrade ? machineLevel >= upgrade.level : false;
}
