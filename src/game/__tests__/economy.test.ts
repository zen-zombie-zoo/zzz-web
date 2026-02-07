import {
  totalCostForQuantity,
  nextUnitCost,
  getEntryFee,
  recalcDps,
  applyTick,
  recalcVisitorRate
} from "../economy";
import { Zombies } from "../zombies";
import { initialState } from "../state";

describe("Economy", () => {
  describe("totalCostForQuantity", () => {
    it("calculates cost for buying 1 unit", () => {
      const def = Zombies.monkey;
      const cost = totalCostForQuantity(def, 0, 1);
      expect(cost).toBe(10); // baseCost
    });

    it("calculates cost for buying multiple units with exponential growth", () => {
      const def = Zombies.monkey;
      // Cost for 2 units starting from 0: 10 + 12.5 = 22.5
      const cost = totalCostForQuantity(def, 0, 2);
      expect(cost).toBeCloseTo(22.5, 1);
    });

    it("increases cost based on already owned units", () => {
      const def = Zombies.monkey;
      const costFromZero = totalCostForQuantity(def, 0, 1);
      const costFromFive = totalCostForQuantity(def, 5, 1);
      expect(costFromFive).toBeGreaterThan(costFromZero);
    });
  });

  describe("nextUnitCost", () => {
    it("returns the cost of the next single unit", () => {
      const def = Zombies.monkey;
      const cost = nextUnitCost(def, 0);
      expect(cost).toBe(10);
    });

    it("increases with ownership", () => {
      const def = Zombies.monkey;
      const second = nextUnitCost(def, 1);
      expect(second).toBe(Math.floor(10 * 1.25));
    });
  });

  describe("getEntryFee", () => {
    it("returns 5 brains per visitor", () => {
      expect(getEntryFee()).toBe(5);
    });
  });

  describe("recalcVisitorRate", () => {
    it("returns 0 with no generators", () => {
      const state = initialState();
      expect(recalcVisitorRate(state)).toBe(0);
    });

    it("calculates rate based on zombie ownership and attraction", () => {
      const state = initialState();
      state.generators.monkey.owned = 10;
      const rate = recalcVisitorRate(state);
      // 10 monkeys * 0.01 attraction * 1 global multiplier = 0.1
      expect(rate).toBeCloseTo(0.1, 5);
    });

    it("applies global multiplier", () => {
      const state = initialState();
      state.generators.monkey.owned = 10;
      state.multipliers.global = 2;
      const rate = recalcVisitorRate(state);
      expect(rate).toBeCloseTo(0.2, 5); // 0.1 * 2
    });

    it("sums rates from multiple zombie types", () => {
      const state = initialState();
      state.generators.monkey.owned = 10; // 10 * 0.01 = 0.1
      state.generators.giraffe.owned = 10; // 10 * 0.02 = 0.2
      const rate = recalcVisitorRate(state);
      expect(rate).toBeCloseTo(0.3, 5); // 0.1 + 0.2
    });
  });

  describe("recalcDps", () => {
    it("returns 0 goldPerSecond with no generators", () => {
      const state = initialState();
      const result = recalcDps(state);
      expect(result.goldPerSecond).toBe(0);
    });

    it("calculates dps from single zombie type", () => {
      const state = initialState();
      state.generators.monkey.owned = 5;
      const result = recalcDps(state);
      // 5 * 1 baseProd * 0.25 perAnimal * 1 global = 1.25, plus visitor brains
      expect(result.goldPerSecond).toBeGreaterThanOrEqual(1.25);
    });

    it("applies multipliers correctly", () => {
      const state = initialState();
      state.generators.monkey.owned = 10;
      state.multipliers.perAnimal.monkey = 2; // 2x per-animal multiplier
      state.multipliers.global = 0.5; // 0.5x global multiplier
      const result = recalcDps(state);
      // 10 * 1 * 2 * 0.5 = 10, plus visitor brains
      expect(result.goldPerSecond).toBeGreaterThanOrEqual(10);
    });

    it("includes visitor brains in dps calculation", () => {
      const state = initialState();
      state.generators.monkey.owned = 100; // high visitor attraction
      const result = recalcDps(state);
      expect(result.goldPerSecond).toBeGreaterThan(0);
      expect(result.visitorRate).toBeGreaterThan(0);
    });
  });

  describe("applyTick", () => {
    it("increases gold based on goldPerSecond and delta time", () => {
      const state = { ...initialState(), goldPerSecond: 10 };
      const result = applyTick(state, 1); // 1 second tick
      expect(result.gold).toBe(100 + 10); // 100 starting + 10 from tick
    });

    it("handles multiple seconds", () => {
      const state = { ...initialState(), goldPerSecond: 5 };
      const result = applyTick(state, 5); // 5 seconds
      expect(result.gold).toBe(100 + 25); // 100 starting + 5*5
    });

    it("rounds gold to avoid floating-point errors", () => {
      const state = { ...initialState(), goldPerSecond: 1 / 3 };
      const result = applyTick(state, 3);
      expect(result.gold).toBe(Math.round(100 + 1)); // Should round cleanly
      expect(result.gold).toBe(101);
    });
  });
});
