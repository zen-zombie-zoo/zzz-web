import { describe, it, expect } from "vitest";
import { getNextUpgrade, isZombieUnlocked, MAX_MACHINE_LEVEL, MACHINE_UPGRADES } from "../machine";

describe("Machine", () => {
  describe("getNextUpgrade", () => {
    it("returns first upgrade for level 0", () => {
      const upgrade = getNextUpgrade(0);
      expect(upgrade).toBeDefined();
      expect(upgrade?.level).toBe(1);
      expect(upgrade?.unlocks).toBe("giraffe");
    });

    it("returns subsequent upgrades", () => {
      const upgrade2 = getNextUpgrade(1);
      expect(upgrade2?.level).toBe(2);
      expect(upgrade2?.unlocks).toBe("penguin");
    });

    it("returns null when at max level", () => {
      const upgrade = getNextUpgrade(MAX_MACHINE_LEVEL);
      expect(upgrade).toBeNull();
    });
  });

  describe("isZombieUnlocked", () => {
    it("always unlocks monkey", () => {
      expect(isZombieUnlocked("monkey", 0)).toBe(true);
      expect(isZombieUnlocked("monkey", 10)).toBe(true);
    });

    it("locks zombies until machine level is reached", () => {
      expect(isZombieUnlocked("giraffe", 0)).toBe(false);
      expect(isZombieUnlocked("giraffe", 1)).toBe(true);
      
      expect(isZombieUnlocked("penguin", 1)).toBe(false);
      expect(isZombieUnlocked("penguin", 2)).toBe(true);
    });

    it("unlocks all zombies at max level", () => {
      const allZombies: Array<"monkey" | "giraffe" | "penguin" | "elephant"> = [
        "monkey",
        "giraffe",
        "penguin",
        "elephant"
      ];
      allZombies.forEach(id => {
        expect(isZombieUnlocked(id, MAX_MACHINE_LEVEL)).toBe(true);
      });
    });
  });

  describe("MACHINE_UPGRADES", () => {
    it("defines sequential upgrade levels", () => {
      expect(MACHINE_UPGRADES[0].level).toBe(1);
      expect(MACHINE_UPGRADES[1].level).toBe(2);
      expect(MACHINE_UPGRADES[2].level).toBe(3);
    });

    it("each upgrade unlocks a zombie", () => {
      expect(MACHINE_UPGRADES[0].unlocks).toBe("giraffe");
      expect(MACHINE_UPGRADES[1].unlocks).toBe("penguin");
      expect(MACHINE_UPGRADES[2].unlocks).toBe("elephant");
    });

    it("upgrades have increasing costs", () => {
      const costs = MACHINE_UPGRADES.map(u => u.cost);
      expect(costs[0]).toBeLessThan(costs[1]);
      expect(costs[1]).toBeLessThan(costs[2]);
    });
  });
});
