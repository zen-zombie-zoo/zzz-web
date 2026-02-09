import type { GameState } from "./types";
import type { ZombieId } from "./zombies";
import { Zombies } from "./zombies";
import { MAX_MACHINE_LEVEL } from "./machine";

export type AchievementCategory = "milestone" | "collection" | "activity";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  check: (stats: PlayerStats, state: GameState) => boolean;
}

export interface PlayerStats {
  totalClicks: number;
  totalBrainsEarned: number;
  totalVisitors: number;
  totalZombiesBought: number;
}

export interface AchievementState {
  unlockedIds: string[];
  stats: PlayerStats;
  pendingUnlock: string | null;
}

export const initialAchievementState = (): AchievementState => ({
  unlockedIds: [],
  stats: {
    totalClicks: 0,
    totalBrainsEarned: 0,
    totalVisitors: 0,
    totalZombiesBought: 0
  },
  pendingUnlock: null
});

const allZombieIds = Object.keys(Zombies) as ZombieId[];

function getTotalOwned(state: GameState): number {
  return Object.values(state.generators).reduce((sum, g) => sum + g.owned, 0);
}

function getOwnedCount(state: GameState, id: ZombieId): number {
  return state.generators[id]?.owned ?? 0;
}

function ownsAllTypes(state: GameState): boolean {
  return allZombieIds.every(id => getOwnedCount(state, id) >= 1);
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Milestones (6)
  {
    id: "first_brain",
    name: "First Steps",
    description: "Earn your first brain",
    category: "milestone",
    icon: "🧠",
    check: stats => stats.totalBrainsEarned >= 1
  },
  {
    id: "thousand_brains",
    name: "Brain Collector",
    description: "Earn 1,000 total brains",
    category: "milestone",
    icon: "🧠",
    check: stats => stats.totalBrainsEarned >= 1000
  },
  {
    id: "million_brains",
    name: "Brain Millionaire",
    description: "Earn 1,000,000 total brains",
    category: "milestone",
    icon: "💰",
    check: stats => stats.totalBrainsEarned >= 1_000_000
  },
  {
    id: "billion_brains",
    name: "Brain Billionaire",
    description: "Earn 1,000,000,000 total brains",
    category: "milestone",
    icon: "👑",
    check: stats => stats.totalBrainsEarned >= 1_000_000_000
  },
  {
    id: "first_upgrade",
    name: "Upgrading",
    description: "Upgrade the machine for the first time",
    category: "milestone",
    icon: "⚙️",
    check: (_, state) => state.machineLevel >= 1
  },
  {
    id: "max_machine",
    name: "Fully Upgraded",
    description: "Reach maximum machine level",
    category: "milestone",
    icon: "🏆",
    check: (_, state) => state.machineLevel >= MAX_MACHINE_LEVEL
  },

  // Collection (7)
  {
    id: "first_zombie",
    name: "Zoo Keeper",
    description: "Buy your first zombie",
    category: "collection",
    icon: "🧟",
    check: stats => stats.totalZombiesBought >= 1
  },
  {
    id: "ten_zombies",
    name: "Growing Horde",
    description: "Own 10 total zombies",
    category: "collection",
    icon: "🧟",
    check: (_, state) => getTotalOwned(state) >= 10
  },
  {
    id: "hundred_zombies",
    name: "Zombie Army",
    description: "Own 100 total zombies",
    category: "collection",
    icon: "💀",
    check: (_, state) => getTotalOwned(state) >= 100
  },
  {
    id: "thousand_zombies",
    name: "Zombie Empire",
    description: "Own 1,000 total zombies",
    category: "collection",
    icon: "🏰",
    check: (_, state) => getTotalOwned(state) >= 1000
  },
  {
    id: "monkey_master",
    name: "Monkey Business",
    description: "Own 25 monkeys",
    category: "collection",
    icon: "🐵",
    check: (_, state) => getOwnedCount(state, "monkey") >= 25
  },
  {
    id: "whale_owner",
    name: "Whale Watcher",
    description: "Own at least 1 whale",
    category: "collection",
    icon: "🐋",
    check: (_, state) => getOwnedCount(state, "whale") >= 1
  },
  {
    id: "one_of_each",
    name: "Diversified",
    description: "Own at least 1 of each zombie type",
    category: "collection",
    icon: "🎯",
    check: (_, state) => ownsAllTypes(state)
  },

  // Activity (5)
  {
    id: "first_click",
    name: "Click!",
    description: "Click the brain for the first time",
    category: "activity",
    icon: "👆",
    check: stats => stats.totalClicks >= 1
  },
  {
    id: "hundred_clicks",
    name: "Clicker",
    description: "Click 100 times",
    category: "activity",
    icon: "👆",
    check: stats => stats.totalClicks >= 100
  },
  {
    id: "thousand_clicks",
    name: "Click Master",
    description: "Click 1,000 times",
    category: "activity",
    icon: "🖱️",
    check: stats => stats.totalClicks >= 1000
  },
  {
    id: "first_visitor",
    name: "Grand Opening",
    description: "Attract your first visitor",
    category: "activity",
    icon: "👥",
    check: stats => stats.totalVisitors >= 1
  },
  {
    id: "hundred_visitors",
    name: "Tourist Trap",
    description: "Attract 100 visitors",
    category: "activity",
    icon: "🎢",
    check: stats => stats.totalVisitors >= 100
  }
];

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function checkForNewAchievements(
  stats: PlayerStats,
  state: GameState,
  unlockedIds: string[]
): string | null {
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.includes(achievement.id)) continue;
    if (achievement.check(stats, state)) {
      return achievement.id;
    }
  }
  return null;
}
