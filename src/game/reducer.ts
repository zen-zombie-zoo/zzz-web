import { Zombies, type ZombieId } from "./zombies";
import { applyTick, recalcDps, totalCostForQuantity, getEntryFee, recalcReputation } from "./economy";
import type { GameState } from "./types";
import { getNextUpgrade } from "./machine";
import { checkForNewAchievements } from "./achievements";
import { getBoostById, cleanExpiredBoosts, getActiveBoostMultipliers } from "./boosts";

export type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "TICK"; seconds: number }
  | { type: "BUY_ANIMAL"; id: ZombieId; qty: number }
  | { type: "CLICK"; amount?: number }
  | { type: "SPAWN_VISITOR" }
  | { type: "UPGRADE_MACHINE" }
  | { type: "DISMISS_ACHIEVEMENT" }
  | { type: "ACTIVATE_BOOST"; boostId: string };

function withAchievementCheck(state: GameState): GameState {
  if (state.achievements.pendingUnlock) return state;

  const newUnlock = checkForNewAchievements(state.achievements.stats, state, state.achievements.unlockedIds);

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
      // Clean expired boosts first
      const cleanedBoosts = cleanExpiredBoosts(state.activeBoosts ?? []);
      const boostsChanged = cleanedBoosts.length !== (state.activeBoosts?.length ?? 0);
      const stateWithCleanBoosts = boostsChanged ? recalcDps({ ...state, activeBoosts: cleanedBoosts }) : state;

      const tickedState = applyTick(stateWithCleanBoosts, action.seconds);
      const { _tickResult, ...newState } = tickedState;
      const { brains: brainsEarned, visitorsSpawned } = _tickResult;

      if (brainsEarned <= 0 && visitorsSpawned <= 0) return newState;

      const { stats } = newState.achievements;
      const updatedState = {
        ...newState,
        reputation: recalcReputation({
          ...newState,
          achievements: {
            ...newState.achievements,
            stats: {
              ...stats,
              totalVisitors: stats.totalVisitors + visitorsSpawned
            }
          }
        }),
        achievements: {
          ...newState.achievements,
          stats: {
            ...stats,
            totalBrainsEarned: stats.totalBrainsEarned + brainsEarned,
            totalVisitors: stats.totalVisitors + visitorsSpawned
          }
        }
      };
      return withAchievementCheck(updatedState);
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
      const boosts = getActiveBoostMultipliers(state.activeBoosts ?? []);
      const baseAmount = action.amount ?? state.clickPower;
      const clickAmount = Math.floor(baseAmount * boosts.clickMultiplier);
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
      const newState = {
        ...state,
        money: state.money + getEntryFee(state.reputation),
        achievements: {
          ...state.achievements,
          stats: {
            ...stats,
            totalVisitors: stats.totalVisitors + 1
          }
        }
      };
      return withAchievementCheck({
        ...newState,
        reputation: recalcReputation(newState)
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

    case "ACTIVATE_BOOST": {
      const boost = getBoostById(action.boostId);
      if (!boost || state.money < boost.cost) return state;

      const newBoost = {
        id: boost.id,
        expiresAt: Date.now() + boost.duration * 1000
      };

      const newState: GameState = {
        ...state,
        money: state.money - boost.cost,
        activeBoosts: [...(state.activeBoosts ?? []), newBoost]
      };

      return recalcDps(newState);
    }

    default:
      return state;
  }
}
