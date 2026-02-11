import { save, load, wipeSave, computeOfflineSeconds } from "../save";
import { initialState } from "../state";

describe("Save & Load", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("save and load", () => {
    it("saves and loads game state", () => {
      const state = { ...initialState(), brains: 500 };
      save(state);
      const loaded = load();
      expect(loaded).toEqual(state);
    });

    it("returns null when no save exists", () => {
      const loaded = load();
      expect(loaded).toBeNull();
    });

    it("overwrites previous save", () => {
      save({ ...initialState(), brains: 100 });
      save({ ...initialState(), brains: 200 });
      const loaded = load();
      expect(loaded?.brains).toBe(200);
    });
  });

  describe("wipeSave", () => {
    it("removes save from localStorage", () => {
      save(initialState());
      wipeSave();
      const loaded = load();
      expect(loaded).toBeNull();
    });
  });

  describe("computeOfflineSeconds", () => {
    it("returns 0 for recent saves", () => {
      const now = Date.now();
      const seconds = computeOfflineSeconds(now);
      expect(seconds).toBe(0);
    });

    it("calculates seconds elapsed", () => {
      const past = Date.now() - 60000; // 60 seconds ago
      const seconds = computeOfflineSeconds(past);
      expect(seconds).toBe(60);
    });

    it("clamps offline progress to 8 hours", () => {
      const twoHoursAgo = Date.now() - 2 * 3600 * 1000;
      const twentyHoursAgo = Date.now() - 20 * 3600 * 1000;

      const recentOffline = computeOfflineSeconds(twoHoursAgo);
      expect(recentOffline).toBe(2 * 3600);

      const oldOffline = computeOfflineSeconds(twentyHoursAgo);
      expect(oldOffline).toBe(8 * 3600); // Clamped to 8 hours
    });
  });
});
