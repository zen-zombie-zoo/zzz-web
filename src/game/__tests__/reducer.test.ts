import { initialState } from "../state";
import { gameReducer } from "../reducer";
import type { GameState } from "../types";

describe("Game Reducer", () => {
  describe("BUY_ANIMAL action", () => {
    it("buys a zombie and deducts cost", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 1 });

      expect(result.generators.monkey.owned).toBe(1);
      expect(result.brains).toBe(100 - 25); // Cost of first monkey is 25
    });

    it("does not allow purchase if insufficient brains", () => {
      const state = { ...initialState(), brains: 5 };
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 1 });

      expect(result).toEqual(state); // State unchanged
      expect(result.generators.monkey.owned).toBe(0);
    });

    it("buys multiple zombies at once", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 2 });

      expect(result.generators.monkey.owned).toBe(2);
      // Cost: 25 + 35 = 60
      expect(result.brains).toBe(40);
    });

    it("recalculates brainsPerSecond after purchase", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 2 });

      expect(result.brainsPerSecond).toBeGreaterThan(0);
      // 2 monkeys * 0.5 baseProd * 0.25 perAnimal * 1 global = 0.25
      expect(result.brainsPerSecond).toBeCloseTo(0.25, 4);
    });
  });

  describe("CLICK action", () => {
    it("adds clickPower to brains when no amount specified", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "CLICK" });

      expect(result.brains).toBe(100 + 1); // clickPower is 1
    });

    it("adds specified amount to brains", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "CLICK", amount: 3 });

      expect(result.brains).toBe(100 + 3);
    });

    it("handles zero amount", () => {
      const state = initialState();
      const result = gameReducer(state, { type: "CLICK", amount: 0 });

      expect(result.brains).toBe(100);
    });

    it("stacks multiple clicks", () => {
      let state = initialState();
      state = gameReducer(state, { type: "CLICK" });
      state = gameReducer(state, { type: "CLICK" });
      state = gameReducer(state, { type: "CLICK" });

      expect(state.brains).toBe(100 + 3);
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
    it("increases brains based on brainsPerSecond", () => {
      const state = { ...initialState(), brainsPerSecond: 10 };
      const result = gameReducer(state, { type: "TICK", seconds: 1 });

      expect(result.brains).toBe(100 + 10);
    });

    it("handles multiple seconds", () => {
      const state = { ...initialState(), brainsPerSecond: 5 };
      const result = gameReducer(state, { type: "TICK", seconds: 10 });

      expect(result.brains).toBe(100 + 50);
    });
  });

  describe("LOAD action", () => {
    it("loads a saved state", () => {
      const savedState: GameState = { ...initialState(), brains: 500, money: 250 };
      const result = gameReducer(initialState(), { type: "LOAD", state: savedState });

      expect(result.brains).toBe(500);
      expect(result.money).toBe(250);
    });

    it("recalculates DPS after loading", () => {
      const savedState: GameState = {
        ...initialState(),
        generators: { ...initialState().generators, monkey: { owned: 10 } }
      };
      const result = gameReducer(initialState(), { type: "LOAD", state: savedState });

      expect(result.brainsPerSecond).toBeGreaterThan(0);
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

      // Buy 2 monkeys (cost: 25 + 35 = 60)
      state = gameReducer(state, { type: "BUY_ANIMAL", id: "monkey", qty: 2 });
      expect(state.generators.monkey.owned).toBe(2);
      expect(state.brainsPerSecond).toBeGreaterThan(0);

      // Tick and earn (need longer tick for lower production rate)
      const initialBrainsAfterBuy = state.brains;
      state = gameReducer(state, { type: "TICK", seconds: 10 });
      expect(state.brains).toBeGreaterThan(initialBrainsAfterBuy);
    });

    it("allows buying more expensive zombies after earning", () => {
      let state = { ...initialState() };

      // Earn from clicks - need 400 brains for giraffe, start with 100
      for (let i = 0; i < 310; i++) {
        state = gameReducer(state, { type: "CLICK" });
      }
      expect(state.brains).toBe(100 + 310); // 410 total

      // Buy giraffe (costs 400)
      state = gameReducer(state, { type: "BUY_ANIMAL", id: "giraffe", qty: 1 });
      expect(state.generators.giraffe.owned).toBe(1);
    });
  });
});
