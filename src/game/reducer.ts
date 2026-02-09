import { Zombies, type ZombieId } from "./zombies";
import { applyTick, recalcDps, totalCostForQuantity, getEntryFee } from "./economy";
import type { GameState } from "./types";
import { getNextUpgrade } from "./machine";
import { checkForNewAchievements, type PlayerStats } from "./achievements";

export type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "TICK"; seconds: number }
  | { type: "BUY_ANIMAL"; id: ZombieId; qty: number }
  | { type: "CLICK"; amount?: number }
  | { type: "SPAWN_VISITOR" }
  | { type: "UPGRADE_MACHINE" }
  | { type: "DISMISS_ACHIEVEMENT" };

function updateStats(
  stats: PlayerStats,
  updates: Partial<PlayerStats>
): PlayerStats {
  return { ...stats, ...updates };
}

function withAchievementCheck(state: GameState): GameState {
  if (state.achievements.pendingUnlock) return state;

  const newUnlock = checkForNewAchievements(
    state.achievements.stats,
    state,
    state.achievements.unlockedIds
  );

  if (newUnlock) {
    return {
      ...state,
      achievements: {
        ...state.achievements,
        unlockedIds: [...state.achievements.unlockedIds, newUnlock],
        pendingUnlock: newUnlock
      }
    };
  }

  return state;
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD":
      return recalcDps(action.state);

    case "TICK": {
      const tickedState = applyTick(state, action.seconds);
      const brainsEarned = tickedState.brains - state.brains;
      if (brainsEarned <= 0) return tickedState;

      const newState: GameState = {
        ...tickedState,
        achievements: {
          ...tickedState.achievements,
          stats: updateStats(tickedState.achievements.stats, {
            totalBrainsEarned:
              tickedState.achievements.stats.totalBrainsEarned + brainsEarned
          })
        }
      };
      return withAchievementCheck(newState);
    }

    case "BUY_ANIMAL": {
      const def = Zombies[action.id];
      const owned = state.generators[action.id]?.owned ?? 0;
      const cost = totalCostForQuantity(def, owned, action.qty);
      if (state.brains < cost) return state;

      const s1: GameState = {
        ...state,
        brains: state.brains - cost,
        generators: {
          ...state.generators,
          [action.id]: { owned: owned + action.qty }
        },
        achievements: {
          ...state.achievements,
          stats: updateStats(state.achievements.stats, {
            totalZombiesBought:
              state.achievements.stats.totalZombiesBought + action.qty
          })
        }
      };
      return withAchievementCheck(recalcDps(s1));
    }

    case "CLICK": {
      const clickAmount = action.amount ?? state.clickPower;
      const newState: GameState = {
        ...state,
        brains: state.brains + clickAmount,
        achievements: {
          ...state.achievements,
          stats: updateStats(state.achievements.stats, {
            totalClicks: state.achievements.stats.totalClicks + 1,
            totalBrainsEarned:
              state.achievements.stats.totalBrainsEarned + clickAmount
          })
        }
      };
      return withAchievementCheck(newState);
    }

    case "SPAWN_VISITOR": {
      const newState: GameState = {
        ...state,
        money: state.money + getEntryFee(),
        achievements: {
          ...state.achievements,
          stats: updateStats(state.achievements.stats, {
            totalVisitors: state.achievements.stats.totalVisitors + 1
          })
        }
      };
      return withAchievementCheck(newState);
    }

    case "UPGRADE_MACHINE": {
      const upgrade = getNextUpgrade(state.machineLevel);
      if (!upgrade || state.money < upgrade.cost) return state;
      const newState: GameState = {
        ...state,
        money: state.money - upgrade.cost,
        machineLevel: upgrade.level
      };
      return withAchievementCheck(newState);
    }

    case "DISMISS_ACHIEVEMENT":
      return {
        ...state,
        achievements: {
          ...state.achievements,
          pendingUnlock: null
        }
      };

    default:
      return state;
  }
}
