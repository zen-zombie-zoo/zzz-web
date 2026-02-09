import { getNextUpgrade, isZombieUnlocked, MAX_MACHINE_LEVEL, MACHINE_UPGRADES } from "../machine";
import type { ZombieId } from "../zombies";

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

    it("returns all 11 upgrades in sequence", () => {
      const expectedUnlocks: ZombieId[] = [
        "giraffe", "penguin", "elephant", "crocodile", "gorilla",
        "moose", "rhino", "narwhal", "walrus", "zebra", "whale"
      ];

      for (let level = 0; level < 11; level++) {
        const upgrade = getNextUpgrade(level);
        expect(upgrade).toBeDefined();
        expect(upgrade?.level).toBe(level + 1);
        expect(upgrade?.unlocks).toBe(expectedUnlocks[level]);
      }
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

    it("correctly unlocks each zombie at its required level", () => {
      const unlockLevels: Array<{ zombie: ZombieId; level: number }> = [
        { zombie: "giraffe", level: 1 },
        { zombie: "penguin", level: 2 },
        { zombie: "elephant", level: 3 },
        { zombie: "crocodile", level: 4 },
        { zombie: "gorilla", level: 5 },
        { zombie: "moose", level: 6 },
        { zombie: "rhino", level: 7 },
        { zombie: "narwhal", level: 8 },
        { zombie: "walrus", level: 9 },
        { zombie: "zebra", level: 10 },
        { zombie: "whale", level: 11 }
      ];

      unlockLevels.forEach(({ zombie, level }) => {
        expect(isZombieUnlocked(zombie, level - 1)).toBe(false);
        expect(isZombieUnlocked(zombie, level)).toBe(true);
      });
    });

    it("unlocks all zombies at max level", () => {
      const allZombies: ZombieId[] = [
        "monkey", "giraffe", "penguin", "elephant",
        "crocodile", "gorilla", "moose", "rhino",
        "narwhal", "walrus", "zebra", "whale"
      ];
      allZombies.forEach(id => {
        expect(isZombieUnlocked(id, MAX_MACHINE_LEVEL)).toBe(true);
      });
    });
  });

  describe("MACHINE_UPGRADES", () => {
    it("has 11 total upgrades", () => {
      expect(MACHINE_UPGRADES.length).toBe(11);
      expect(MAX_MACHINE_LEVEL).toBe(11);
    });

    it("defines sequential upgrade levels from 1 to 11", () => {
      for (let i = 0; i < MACHINE_UPGRADES.length; i++) {
        expect(MACHINE_UPGRADES[i].level).toBe(i + 1);
      }
    });

    it("each upgrade unlocks a zombie", () => {
      const expectedUnlocks: ZombieId[] = [
        "giraffe", "penguin", "elephant", "crocodile", "gorilla",
        "moose", "rhino", "narwhal", "walrus", "zebra", "whale"
      ];

      MACHINE_UPGRADES.forEach((upgrade, index) => {
        expect(upgrade.unlocks).toBe(expectedUnlocks[index]);
      });
    });

    it("each upgrade has a name", () => {
      const expectedNames = [
        "Giraffe Habitat", "Penguin Enclosure", "Elephant Sanctuary",
        "Crocodile Swamp", "Gorilla Jungle", "Moose Meadow",
        "Rhino Ranch", "Narwhal Iceberg", "Walrus Tundra",
        "Zebra Savanna", "Whale Ocean"
      ];

      MACHINE_UPGRADES.forEach((upgrade, index) => {
        expect(upgrade.name).toBe(expectedNames[index]);
      });
    });

    it("upgrades have strictly increasing costs", () => {
      for (let i = 1; i < MACHINE_UPGRADES.length; i++) {
        expect(MACHINE_UPGRADES[i].cost).toBeGreaterThan(MACHINE_UPGRADES[i - 1].cost);
      }
    });

    it("upgrade costs grow exponentially", () => {
      // Each upgrade costs significantly more than the previous
      for (let i = 1; i < MACHINE_UPGRADES.length; i++) {
        const ratio = MACHINE_UPGRADES[i].cost / MACHINE_UPGRADES[i - 1].cost;
        expect(ratio).toBeGreaterThanOrEqual(4);
        expect(ratio).toBeLessThanOrEqual(5);
      }
    });
  });
});
