import { Zombies, type ZombieId } from "./zombies";
import { applyTick, recalcDps, totalCostForQuantity, getEntryFee } from "./economy";
import type { GameState } from "./types";
import { getNextUpgrade } from "./machine";

export type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "TICK"; seconds: number }
  | { type: "BUY_ANIMAL"; id: ZombieId; qty: number }
  | { type: "CLICK" }
  | { type: "SPAWN_VISITOR" }
  | { type: "UPGRADE_MACHINE" };

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD":
      return recalcDps(action.state);
    case "TICK":
      return applyTick(state, action.seconds);
    case "BUY_ANIMAL": {
      const def = Zombies[action.id];
      const owned = state.generators[action.id]?.owned ?? 0;
      const cost = totalCostForQuantity(def, owned, action.qty);
      if (state.gold < cost) return state;

      const s1: GameState = {
        ...state,
        gold: state.gold - cost,
        generators: {
          ...state.generators,
          [action.id]: { owned: owned + action.qty }
        }
      };
      return recalcDps(s1);
    }

    case "CLICK":
      return {
        ...state,
        gold: state.gold + state.clickPower
      };

    case "SPAWN_VISITOR":
      return {
        ...state,
        money: state.money + getEntryFee()
      };

    case "UPGRADE_MACHINE": {
      const upgrade = getNextUpgrade(state.machineLevel);
      if (!upgrade || state.money < upgrade.cost) return state;
      return {
        ...state,
        money: state.money - upgrade.cost,
        machineLevel: upgrade.level
      };
    }

    default:
      return state;
  }
}
