import { createContext } from "react";
import type { ZombieId } from "./zombies";
import type { nextUnitCost } from "./economy";
import type { GameState } from "./types";

export type GameCtxType = {
  state: GameState;
  buyZombie: (id: ZombieId, qty?: number) => void;
  nextCost: (id: ZombieId) => ReturnType<typeof nextUnitCost>;
  collectBrain: () => void;
  spawnVisitor: () => void;
};

export const GameCtx = createContext<GameCtxType | null>(null);
