import { getNextUpgrade, isZombieUnlocked, MAX_MACHINE_LEVEL, MACHINE_UPGRADES } from "../machine";
import { Zombies, type ZombieId } from "../zombies";

describe("Machine", () => {
  describe("getNextUpgrade", () => {
    it("returns first upgrade for level 0", () => {
      const upgrade = getNextUpgrade(0);
      expect(upgrade).toBeDefined();
      expect(upgrade?.level).toBe(1);
      expect(upgrade?.unlocks).toBe("teacher");
    });

    it("returns subsequent upgrades", () => {
      const upgrade2 = getNextUpgrade(1);
      expect(upgrade2?.level).toBe(2);
      expect(upgrade2?.unlocks).toBe("penguin");
    });

    it("returns all 11 upgrades in sequence", () => {
      const expectedUnlocks: ZombieId[] = [
        Zombies.teacher.id,
        Zombies.penguin.id,
        Zombies.elephant.id,
        Zombies.crocodile.id,
        Zombies.gorilla.id,
        Zombies.moose.id,
        Zombies.rhino.id,
        Zombies.narwhal.id,
        Zombies.walrus.id,
        Zombies.zebra.id,
        Zombies.whale.id
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
    it("always unlocks officer worker zombies", () => {
      expect(isZombieUnlocked(Zombies.officerWorker.id, 0)).toBe(true);
      expect(isZombieUnlocked(Zombies.officerWorker.id, 10)).toBe(true);
    });

    it("locks zombies until machine level is reached", () => {
      expect(isZombieUnlocked(Zombies.teacher.id, 0)).toBe(false);
      expect(isZombieUnlocked(Zombies.teacher.id, 1)).toBe(true);

      expect(isZombieUnlocked("penguin", 1)).toBe(false);
      expect(isZombieUnlocked("penguin", 2)).toBe(true);
    });

    it("correctly unlocks each zombie at its required level", () => {
      const unlockLevels: Array<{ zombie: ZombieId; level: number }> = [
        { zombie: Zombies.teacher.id, level: 1 },
        { zombie: Zombies.penguin.id, level: 2 },
        { zombie: Zombies.elephant.id, level: 3 },
        { zombie: Zombies.crocodile.id, level: 4 },
        { zombie: Zombies.gorilla.id, level: 5 },
        { zombie: Zombies.moose.id, level: 6 },
        { zombie: Zombies.rhino.id, level: 7 },
        { zombie: Zombies.narwhal.id, level: 8 },
        { zombie: Zombies.walrus.id, level: 9 },
        { zombie: Zombies.zebra.id, level: 10 },
        { zombie: Zombies.whale.id, level: 11 }
      ];

      unlockLevels.forEach(({ zombie, level }) => {
        expect(isZombieUnlocked(zombie, level - 1)).toBe(false);
        expect(isZombieUnlocked(zombie, level)).toBe(true);
      });
    });

    it("unlocks all zombies at max level", () => {
      const allZombies: ZombieId[] = [
        Zombies.officerWorker.id,
        Zombies.teacher.id,
        Zombies.penguin.id,
        Zombies.elephant.id,
        Zombies.crocodile.id,
        Zombies.gorilla.id,
        Zombies.moose.id,
        Zombies.rhino.id,
        Zombies.narwhal.id,
        Zombies.walrus.id,
        Zombies.zebra.id,
        Zombies.whale.id
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
        Zombies.teacher.id,
        Zombies.penguin.id,
        Zombies.elephant.id,
        Zombies.crocodile.id,
        Zombies.gorilla.id,
        Zombies.moose.id,
        Zombies.rhino.id,
        Zombies.narwhal.id,
        Zombies.walrus.id,
        Zombies.zebra.id,
        Zombies.whale.id
      ];

      MACHINE_UPGRADES.forEach((upgrade, index) => {
        expect(upgrade.unlocks).toBe(expectedUnlocks[index]);
      });
    });

    it("each upgrade has a name", () => {
      const expectedNames = [
        "Teacher Habitat",
        "Penguin Enclosure",
        "Elephant Sanctuary",
        "Crocodile Swamp",
        "Gorilla Jungle",
        "Moose Meadow",
        "Rhino Ranch",
        "Narwhal Iceberg",
        "Walrus Tundra",
        "Zebra Savanna",
        "Whale Ocean"
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
