import { ZOMBIE_SIZE, VISITOR_SIZE, MACHINE_SIZE, MACHINE_PADDING, drawZombie, drawVisitor, drawFloatingText, clearCanvas } from "../renderer";
import { Zombies } from "../zombies";

// Mock canvas context
function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: "",
    strokeStyle: "",
    globalAlpha: 1,
    lineWidth: 1,
    font: "",
    textAlign: "left",
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    roundRect: vi.fn()
  } as unknown as CanvasRenderingContext2D;
}

describe("renderer", () => {
  describe("constants", () => {
    it("defines ZOMBIE_SIZE", () => {
      expect(ZOMBIE_SIZE).toBe(48);
    });

    it("defines VISITOR_SIZE", () => {
      expect(VISITOR_SIZE).toBe(24);
    });

    it("defines MACHINE_SIZE", () => {
      expect(MACHINE_SIZE).toBe(64);
    });

    it("defines MACHINE_PADDING", () => {
      expect(MACHINE_PADDING).toBe(20);
    });
  });

  describe("clearCanvas", () => {
    it("clears and fills the canvas", () => {
      const ctx = createMockContext();

      clearCanvas(ctx, 800, 600);

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe("drawVisitor", () => {
    it("draws visitor body circle", () => {
      const ctx = createMockContext();

      drawVisitor(ctx, 100, 100);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });
  });

  describe("drawFloatingText", () => {
    it("draws text with correct alpha", () => {
      const ctx = createMockContext();

      drawFloatingText(ctx, 100, 100, "+5", 0.5);

      expect(ctx.globalAlpha).toBe(1); // Reset after drawing
      expect(ctx.fillText).toHaveBeenCalledWith("+5", 100, 100);
    });

    it("sets font and alignment", () => {
      const ctx = createMockContext();

      drawFloatingText(ctx, 100, 100, "+10", 1);

      expect(ctx.font).toBe("bold 20px sans-serif");
      expect(ctx.textAlign).toBe("center");
    });
  });

  describe("drawZombie", () => {
    it("draws fallback circle when image not loaded", () => {
      const ctx = createMockContext();

      // Images won't be loaded in test environment
      drawZombie(ctx, Zombies.officerWorker.id, 100, 100);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });
  });
});
