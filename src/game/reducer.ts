import { Zombies, type ZombieId } from "./zombies";
import { applyTick, recalcDps, totalCostForQuantity, getEntryFee } from "./economy";
import type { GameState } from "./types";
import { getNextUpgrade } from "./machine";
import { checkForNewAchievements } from "./achievements";

export type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "TICK"; seconds: number }
  | { type: "BUY_ANIMAL"; id: ZombieId; qty: number }
  | { type: "CLICK"; amount?: number }
  | { type: "SPAWN_VISITOR" }
  | { type: "UPGRADE_MACHINE" }
  | { type: "DISMISS_ACHIEVEMENT" };

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

      const { stats } = tickedState.achievements;
      return withAchievementCheck({
        ...tickedState,
        achievements: {
          ...tickedState.achievements,
          stats: {
            ...stats,
            totalBrainsEarned: stats.totalBrainsEarned + brainsEarned
          }
        }
      });
    }

    case "BUY_ANIMAL": {
      const def = Zombies[action.id];
      const owned = state.generators[action.id]?.owned ?? 0;
      const cost = totalCostForQuantity(def, owned, action.qty);
      if (state.brains < cost) return state;

      const { stats } = state.achievements;
      return withAchievementCheck(
        recalcDps({
          ...state,
          brains: state.brains - cost,
          generators: {
            ...state.generators,
            [action.id]: { owned: owned + action.qty }
          },
          achievements: {
            ...state.achievements,
            stats: {
              ...stats,
              totalZombiesBought: stats.totalZombiesBought + action.qty
            }
          }
        })
      );
    }

    case "CLICK": {
      const clickAmount = action.amount ?? state.clickPower;
      const { stats } = state.achievements;
      return withAchievementCheck({
        ...state,
        brains: state.brains + clickAmount,
        achievements: {
          ...state.achievements,
          stats: {
            ...stats,
            totalClicks: stats.totalClicks + 1,
            totalBrainsEarned: stats.totalBrainsEarned + clickAmount
          }
        }
      });
    }

    case "SPAWN_VISITOR": {
      const { stats } = state.achievements;
      return withAchievementCheck({
        ...state,
        money: state.money + getEntryFee(),
        achievements: {
          ...state.achievements,
          stats: {
            ...stats,
            totalVisitors: stats.totalVisitors + 1
          }
        }
      });
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
