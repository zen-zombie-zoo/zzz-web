import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import { Zombies, type ZombieId } from "./zombies";
import { initialState } from "./state";
import { applyTick, recalcDps, totalCostForQuantity, nextUnitCost } from "./economy";
import { load, save, computeOfflineSeconds } from "./save";
import { TICK_RATE_MS } from "./tick";
import type { GameState } from "./types";

type Action = { type: "LOAD"; state: GameState } | { type: "TICK"; seconds: number } | { type: "BUY_ANIMAL"; id: ZombieId; qty: number };

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

    default:
      return state;
  }
}

type Ctx = {
  state: GameState;
  buyZombie: (id: ZombieId, qty?: number) => void;
  nextCost: (id: ZombieId) => ReturnType<typeof nextUnitCost>;
};

const GameCtx = createContext<Ctx | null>(null);

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

  const api = useMemo<Ctx>(
    () => ({
      state,
      buyZombie: (id, qty = 1) => dispatch({ type: "BUY_ANIMAL", id, qty }),
      nextCost: id => nextUnitCost(Zombies[id], state.generators[id]?.owned ?? 0)
    }),
    [state]
  );

  return <GameCtx.Provider value={api}>{children}</GameCtx.Provider>;
};

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
