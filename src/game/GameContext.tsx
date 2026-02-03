import React, { useEffect, useMemo, useReducer, useRef } from "react";

import { Zombies, type ZombieId } from "./zombies";
import { initialState } from "./state";
import { applyTick, recalcDps, totalCostForQuantity, nextUnitCost, getEntryFee } from "./economy";
import { load, save, computeOfflineSeconds } from "./save";
import { TICK_RATE_MS } from "./tick";
import type { GameState } from "./types";
import { GameCtx, type GameCtxType } from "./context";

type Action =
  | { type: "LOAD"; state: GameState }
  | { type: "TICK"; seconds: number }
  | { type: "BUY_ANIMAL"; id: ZombieId; qty: number }
  | { type: "CLICK" }
  | { type: "SPAWN_VISITOR" };

function reducer(state: GameState, action: Action): GameState {
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

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as GameState, () => {
    const saved = load();
    return saved ?? initialState();
  });

  // Offline progress once on mount
  useEffect(() => {
    const saved = load();
    if (saved) {
      const seconds = computeOfflineSeconds(saved.lastSavedAt);
      if (seconds > 0) dispatch({ type: "TICK", seconds });
    }
  }, []);

  // Idle tick loop (1s)
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "TICK", seconds: TICK_RATE_MS / 1000 });
    }, TICK_RATE_MS);
    return () => clearInterval(id);
  }, []);

  // Autosave every 5s & on unload
  useEffect(() => {
    const id = setInterval(() => save({ ...state, lastSavedAt: Date.now() }), 5000);
    const onUnload = () => save({ ...state, lastSavedAt: Date.now() });
    window.addEventListener("beforeunload", onUnload);
    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [state]);

  // Visitor spawn timer
  const visitorAccumRef = useRef(0);
  useEffect(() => {
    const VISITOR_TICK_MS = 1000;
    const id = setInterval(() => {
      if (state.visitorRate <= 0) return;

      visitorAccumRef.current += state.visitorRate * (VISITOR_TICK_MS / 1000);

      while (visitorAccumRef.current >= 1) {
        visitorAccumRef.current -= 1;
        dispatch({ type: "SPAWN_VISITOR" });
      }
    }, VISITOR_TICK_MS);
    return () => clearInterval(id);
  }, [state.visitorRate]);

  const api = useMemo<GameCtxType>(
    () => ({
      state,
      buyZombie: (id, qty = 1) => dispatch({ type: "BUY_ANIMAL", id, qty }),
      nextCost: id => nextUnitCost(Zombies[id], state.generators[id]?.owned ?? 0),
      collectBrain: () => dispatch({ type: "CLICK" }),
      spawnVisitor: () => dispatch({ type: "SPAWN_VISITOR" })
    }),
    [state]
  );

  return <GameCtx.Provider value={api}>{children}</GameCtx.Provider>;
};
