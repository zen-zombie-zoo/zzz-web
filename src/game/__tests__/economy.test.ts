import { totalCostForQuantity, nextUnitCost, getEntryFee, recalcDps, applyTick, recalcVisitorRate, recalcReputation } from "../economy";
import { Zombies } from "../zombies";
import { initialState } from "../state";

describe("Economy", () => {
  describe("totalCostForQuantity", () => {
    it("calculates cost for buying 1 unit", () => {
      const def = Zombies.officerWorker;
      const cost = totalCostForQuantity(def, 0, 1);
      expect(cost).toBe(25); // baseCost
    });

    it("calculates cost for buying multiple units with exponential growth", () => {
      const def = Zombies.officerWorker;
      // Cost for 2 units starting from 0: 25 + 35 = 60
      const cost = totalCostForQuantity(def, 0, 2);
      expect(cost).toBeCloseTo(60, 0);
    });

    it("increases cost based on already owned units", () => {
      const def = Zombies.officerWorker;
      const costFromZero = totalCostForQuantity(def, 0, 1);
      const costFromFive = totalCostForQuantity(def, 5, 1);
      expect(costFromFive).toBeGreaterThan(costFromZero);
    });
  });

  describe("nextUnitCost", () => {
    it("returns the cost of the next single unit", () => {
      const def = Zombies.officerWorker;
      const cost = nextUnitCost(def, 0);
      expect(cost).toBe(25);
    });

    it("increases with ownership", () => {
      const def = Zombies.officerWorker;
      const second = nextUnitCost(def, 1);
      expect(second).toBe(Math.floor(25 * 1.4));
    });
  });

  describe("getEntryFee", () => {
    it("returns base fee of 5 at 0 reputation", () => {
      expect(getEntryFee(0)).toBe(5);
    });

    it("returns higher fee with reputation", () => {
      // At 100 reputation: 5 * (1 + 100 * 0.005) = 5 * 1.5 = 7.5
      expect(getEntryFee(100)).toBe(7.5);
    });

    it("scales linearly with reputation", () => {
      // At 50 reputation: 5 * (1 + 50 * 0.005) = 5 * 1.25 = 6.25
      expect(getEntryFee(50)).toBe(6.25);
    });
  });

  describe("recalcReputation", () => {
    it("returns 0 with no visitors", () => {
      const state = initialState();
      expect(recalcReputation(state)).toBe(0);
    });

    it("increases with total visitors", () => {
      const state = initialState();
      state.achievements.stats.totalVisitors = 100;
      expect(recalcReputation(state)).toBe(10);
    });

    it("caps at 100", () => {
      const state = initialState();
      state.achievements.stats.totalVisitors = 2000;
      expect(recalcReputation(state)).toBe(100);
    });

    it("reaches max at 1000 visitors", () => {
      const state = initialState();
      state.achievements.stats.totalVisitors = 1000;
      expect(recalcReputation(state)).toBe(100);
    });
  });

  describe("recalcVisitorRate", () => {
    it("returns 0 with no generators", () => {
      const state = initialState();
      expect(recalcVisitorRate(state)).toBe(0);
    });

    it("calculates rate based on zombie ownership and attraction", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 10;
      const rate = recalcVisitorRate(state);
      // 10 office worker zombies * 0.01 attraction * 1 global multiplier = 0.1
      expect(rate).toBeCloseTo(0.1, 5);
    });

    it("applies global multiplier", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 10;
      state.multipliers.global = 2;
      const rate = recalcVisitorRate(state);
      expect(rate).toBeCloseTo(0.2, 5); // 0.1 * 2
    });

    it("sums rates from multiple zombie types", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 10; // 10 * 0.01 = 0.1
      state.generators[Zombies.teacher.id].owned = 10; // 10 * 0.02 = 0.2
      const rate = recalcVisitorRate(state);
      expect(rate).toBeCloseTo(0.3, 5); // 0.1 + 0.2
    });
  });

  describe("recalcDps", () => {
    it("returns 0 brainsPerSecond with no generators", () => {
      const state = initialState();
      const result = recalcDps(state);
      expect(result.brainsPerSecond).toBe(0);
    });

    it("calculates dps from single zombie type", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 5;
      const result = recalcDps(state);
      // 5 * 0.5 baseProd * 0.25 perAnimal * 1 global = 0.625
      expect(result.brainsPerSecond).toBeCloseTo(0.625, 4);
    });

    it("applies multipliers correctly", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 10;
      state.multipliers.perAnimal[Zombies.officerWorker.id] = 2; // 2x per-animal multiplier
      state.multipliers.global = 0.5; // 0.5x global multiplier
      const result = recalcDps(state);
      // 10 * 0.5 baseProd * 2 perAnimal * 0.5 global = 5
      expect(result.brainsPerSecond).toBeCloseTo(5, 4);
    });

    it("calculates visitorRate alongside brainsPerSecond", () => {
      const state = initialState();
      state.generators[Zombies.officerWorker.id].owned = 100;
      const result = recalcDps(state);
      // brainsPerSecond only reflects zombie production, not visitor contributions
      expect(result.brainsPerSecond).toBeGreaterThan(0);
      // visitorRate is calculated for spawning visitors (which give money, not brains)
      expect(result.visitorRate).toBeGreaterThan(0);
    });
  });

  describe("applyTick", () => {
    it("increases brains based on brainsPerSecond and delta time", () => {
      const state = { ...initialState(), brainsPerSecond: 10 };
      const result = applyTick(state, 1); // 1 second tick
      expect(result.brains).toBe(100 + 10); // 100 starting + 10 from tick
    });

    it("handles multiple seconds", () => {
      const state = { ...initialState(), brainsPerSecond: 5 };
      const result = applyTick(state, 5); // 5 seconds
      expect(result.brains).toBe(100 + 25); // 100 starting + 5*5
    });

    it("accumulates fractional brains over time", () => {
      const state = { ...initialState(), brainsPerSecond: 0.25 };
      let result = applyTick(state, 1);
      expect(result.brains).toBeCloseTo(100.25, 10);
      result = applyTick(result, 1);
      expect(result.brains).toBeCloseTo(100.5, 10);
      result = applyTick(result, 1);
      expect(result.brains).toBeCloseTo(100.75, 10);
      result = applyTick(result, 1);
      expect(result.brains).toBeCloseTo(101, 10);
    });
  });
});
