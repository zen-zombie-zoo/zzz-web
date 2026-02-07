import { initialState } from "../state";
import { gameReducer } from "../GameContext";
import type { GameState } from "../types";

describe("Game Reducer", () => {
  describe("BUY_ANIMAL action", () => {
    it("buys a zombie and deducts cost", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 1 });
      
      expect(result.generators.monkey.owned).toBe(1);
      expect(result.gold).toBe(100 - 10); // Cost of first monkey is 10
    });

    it("does not allow purchase if insufficient gold", () => {
      const state = { ...initialState(), gold: 5 };
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 1 });
      
      expect(result).toEqual(state); // State unchanged
      expect(result.generators.monkey.owned).toBe(0);
    });

    it("buys multiple zombies at once", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 3 });
      
      expect(result.generators.monkey.owned).toBe(3);
      // Cost: 10 + 12.5 + 15.625
      expect(result.gold).toBeLessThan(100);
    });

    it("recalculates goldPerSecond after purchase", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 5 });
      
      expect(result.goldPerSecond).toBeGreaterThan(0);
      // 5 monkeys * 1 baseProd * 0.25 perAnimal * 1 global = 1.25, plus visitor brains
      expect(result.goldPerSecond).toBeGreaterThanOrEqual(1.25);
    });
  });

  describe("CLICK action", () => {
    it("adds clickPower to gold", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "CLICK" });
      
      expect(result.gold).toBe(100 + 1); // clickPower is 1
    });

    it("stacks multiple clicks", () => {
      let state = initialState();
      state = gameReducer(state, { type: "CLICK" });
      state = gameReducer(state, { type: "CLICK" });
      state = gameReducer(state, { type: "CLICK" });
      
      expect(state.gold).toBe(100 + 3);
    });
  });

  describe("SPAWN_VISITOR action", () => {
    it("adds entry fee to money", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "SPAWN_VISITOR" });
      
      expect(result.money).toBe(5); // Entry fee is 5
    });

    it("stacks multiple visitors", () => {
      let state = initialState();
      state = gameReducer(state, { type: "SPAWN_VISITOR" });
      state = gameReducer(state, { type: "SPAWN_VISITOR" });
      
      expect(state.money).toBe(10);
    });
  });

  describe("TICK action", () => {
    it("increases gold based on goldPerSecond", () => {
      const state = { ...initialState(), goldPerSecond: 10 };
      const result = gameReducer(state, { type: "TICK", seconds: 1 });
      
      expect(result.gold).toBe(100 + 10);
    });

    it("handles multiple seconds", () => {
      const state = { ...initialState(), goldPerSecond: 5 };
      const result = gameReducer(state, { type: "TICK", seconds: 10 });
      
      expect(result.gold).toBe(100 + 50);
    });
  });

  describe("LOAD action", () => {
    it("loads a saved state", () => {
      const savedState: GameState = { ...initialState(), gold: 500, money: 250 };
      const result = gameReducer(initialState(), { type: "LOAD", state: savedState });
      
      expect(result.gold).toBe(500);
      expect(result.money).toBe(250);
    });

    it("recalculates DPS after loading", () => {
      const savedState: GameState = {
        ...initialState(),
        generators: { ...initialState().generators, monkey: { owned: 10 } }
      };
      const result = gameReducer(initialState(), { type: "LOAD", state: savedState });
      
      expect(result.goldPerSecond).toBeGreaterThan(0);
    });
  });

  describe("UPGRADE_MACHINE action", () => {
    it("upgrades machine when enough money", () => {
      const state = { ...initialState(), money: 1000, machineLevel: 0 };
      const result = gameReducer(state, { type: "UPGRADE_MACHINE" });
      
      expect(result.machineLevel).toBeGreaterThan(0);
      expect(result.money).toBeLessThan(1000);
    });

    it("does not upgrade when insufficient money", () => {
      const state = { ...initialState(), money: 5, machineLevel: 0 };
      const result = gameReducer(state, { type: "UPGRADE_MACHINE" });
      
      expect(result).toEqual(state);
    });

    it("does not upgrade when at max level", () => {
      const state = { ...initialState(), money: 10000, machineLevel: 100 };
      const result = gameReducer(state, { type: "UPGRADE_MACHINE" });
      
      // Should be unchanged if no more upgrades available
      expect(result.machineLevel).toBe(100);
    });
  });

  describe("Complex workflows", () => {
    it("can buy a zombie and then earn from it", () => {
      let state = { ...initialState() };
      
      // Buy 5 monkeys (cost: 10 + 12.5 + 15.625 + 19.53 + 24.41 = ~81.5)
      state = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 5 });
      expect(state.generators.monkey.owned).toBe(5);
      expect(state.goldPerSecond).toBeGreaterThan(0);
      
      // Tick and earn
      const initialGoldAfterBuy = state.gold;
      state = gameReducer(state, { type: "TICK", seconds: 1 });
      expect(state.gold).toBeGreaterThan(initialGoldAfterBuy);
    });

    it("allows buying more expensive zombies after earning", () => {
      let state = { ...initialState() };
      
      // Earn from clicks - need 150 gold for giraffe, start with 100
      for (let i = 0; i < 60; i++) {
        state = gameReducer(state, { type: "CLICK" });
      }
      expect(state.gold).toBe(100 + 60); // 160 total
      
      // Buy giraffe (costs 150)
      state = gameReducer(state, { type: "BUY_ANIMAL", id: "giraffe", qty: 1 });
      expect(state.generators.giraffe.owned).toBe(1);
    });
  });
});
