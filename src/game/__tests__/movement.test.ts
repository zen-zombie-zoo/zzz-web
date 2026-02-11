import { type Entity, type Bounds, ZOMBIE_SPEED, VISITOR_SPEED, createCardinalVelocity, updateZombieMovement, updateVisitorMovement } from "../movement";

describe("movement", () => {
  describe("constants", () => {
    it("defines ZOMBIE_SPEED", () => {
      expect(ZOMBIE_SPEED).toBe(10);
    });

    it("defines VISITOR_SPEED", () => {
      expect(VISITOR_SPEED).toBe(20);
    });
  });

  describe("createCardinalVelocity", () => {
    it("returns only cardinal directions (no diagonals)", () => {
      for (let i = 0; i < 100; i++) {
        const { vx, vy } = createCardinalVelocity(10);
        // One must be 0, the other non-zero
        const isCardinal = (vx === 0 && vy !== 0) || (vx !== 0 && vy === 0);
        expect(isCardinal).toBe(true);
      }
    });

    it("uses the provided speed value", () => {
      for (let i = 0; i < 100; i++) {
        const speed = 15;
        const { vx, vy } = createCardinalVelocity(speed);
        const magnitude = Math.abs(vx) + Math.abs(vy);
        expect(magnitude).toBe(speed);
      }
    });

    it("produces all four directions over many calls", () => {
      const directions = { right: false, left: false, up: false, down: false };

      for (let i = 0; i < 100; i++) {
        const { vx, vy } = createCardinalVelocity(10);
        if (vx > 0) directions.right = true;
        if (vx < 0) directions.left = true;
        if (vy > 0) directions.down = true;
        if (vy < 0) directions.up = true;
      }

      expect(directions.right).toBe(true);
      expect(directions.left).toBe(true);
      expect(directions.up).toBe(true);
      expect(directions.down).toBe(true);
    });
  });

  describe("updateZombieMovement", () => {
    const bounds: Bounds = {
      width: 800,
      height: 600,
      padding: 10,
      topPadding: 30
    };
    const entitySize = 48;

    it("updates position based on velocity and dt", () => {
      const entity: Entity = { x: 100, y: 100, vx: ZOMBIE_SPEED, vy: 0 };
      const originalX = entity.x;

      // Mock Math.random to prevent turning
      const mockRandom = vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 1);

      expect(entity.x).toBe(originalX + ZOMBIE_SPEED);
      expect(entity.y).toBe(100);

      mockRandom.mockRestore();
    });

    it("bounces off left wall", () => {
      const entity: Entity = { x: 5, y: 100, vx: -ZOMBIE_SPEED, vy: 0 };
      vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 0.1);

      expect(entity.x).toBe(bounds.padding);
      expect(entity.vx).toBe(ZOMBIE_SPEED);
      expect(entity.vy).toBe(0);

      vi.restoreAllMocks();
    });

    it("bounces off right wall", () => {
      const entity: Entity = {
        x: bounds.width - entitySize - 5,
        y: 100,
        vx: ZOMBIE_SPEED,
        vy: 0
      };
      vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 0.1);

      expect(entity.x).toBe(bounds.width - entitySize - bounds.padding);
      expect(entity.vx).toBe(-ZOMBIE_SPEED);
      expect(entity.vy).toBe(0);

      vi.restoreAllMocks();
    });

    it("bounces off top wall", () => {
      const entity: Entity = { x: 100, y: 25, vx: 0, vy: -ZOMBIE_SPEED };
      vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 0.1);

      expect(entity.y).toBe(bounds.topPadding);
      expect(entity.vy).toBe(ZOMBIE_SPEED);
      expect(entity.vx).toBe(0);

      vi.restoreAllMocks();
    });

    it("bounces off bottom wall", () => {
      const entity: Entity = {
        x: 100,
        y: bounds.height - entitySize - 5,
        vx: 0,
        vy: ZOMBIE_SPEED
      };
      vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 0.1);

      expect(entity.y).toBe(bounds.height - entitySize - bounds.padding);
      expect(entity.vy).toBe(-ZOMBIE_SPEED);
      expect(entity.vx).toBe(0);

      vi.restoreAllMocks();
    });

    it("maintains cardinal movement after wall bounce", () => {
      const entity: Entity = { x: 5, y: 100, vx: -ZOMBIE_SPEED, vy: 0 };
      vi.spyOn(Math, "random").mockReturnValue(1);

      updateZombieMovement(entity, bounds, entitySize, 0.1);

      // Should only move in one direction after bounce
      const isCardinal = (entity.vx === 0 && entity.vy !== 0) || (entity.vx !== 0 && entity.vy === 0);
      expect(isCardinal).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe("updateVisitorMovement", () => {
    const bounds: Bounds = {
      width: 800,
      height: 600,
      padding: 10,
      topPadding: 30
    };
    const entitySize = 24;

    it("updates position based on velocity and dt", () => {
      const entity: Entity = { x: 100, y: 100, vx: 15, vy: 10 };

      updateVisitorMovement(entity, bounds, entitySize, 1);

      expect(entity.x).toBe(115);
      expect(entity.y).toBe(110);
    });

    it("allows diagonal movement", () => {
      const entity: Entity = { x: 100, y: 100, vx: 15, vy: 10 };

      updateVisitorMovement(entity, bounds, entitySize, 1);

      // Both velocities should remain non-zero (diagonal)
      expect(entity.vx).toBe(15);
      expect(entity.vy).toBe(10);
    });

    it("reflects off left wall", () => {
      const entity: Entity = { x: 5, y: 100, vx: -15, vy: 10 };

      updateVisitorMovement(entity, bounds, entitySize, 0.1);

      expect(entity.x).toBe(bounds.padding);
      expect(entity.vx).toBe(15); // Reflected
      expect(entity.vy).toBe(10); // Unchanged
    });

    it("reflects off right wall", () => {
      const entity: Entity = {
        x: bounds.width - entitySize - 5,
        y: 100,
        vx: 15,
        vy: 10
      };

      updateVisitorMovement(entity, bounds, entitySize, 0.1);

      expect(entity.x).toBe(bounds.width - entitySize - bounds.padding);
      expect(entity.vx).toBe(-15); // Reflected
      expect(entity.vy).toBe(10); // Unchanged
    });

    it("reflects off top wall", () => {
      const entity: Entity = { x: 100, y: 25, vx: 15, vy: -10 };

      updateVisitorMovement(entity, bounds, entitySize, 0.1);

      expect(entity.y).toBe(bounds.topPadding);
      expect(entity.vx).toBe(15); // Unchanged
      expect(entity.vy).toBe(10); // Reflected
    });

    it("reflects off bottom wall", () => {
      const entity: Entity = {
        x: 100,
        y: bounds.height - entitySize - 5,
        vx: 15,
        vy: 10
      };

      updateVisitorMovement(entity, bounds, entitySize, 0.1);

      expect(entity.y).toBe(bounds.height - entitySize - bounds.padding);
      expect(entity.vx).toBe(15); // Unchanged
      expect(entity.vy).toBe(-10); // Reflected
    });
  });
});
