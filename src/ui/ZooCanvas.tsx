import React, { useEffect, useRef } from "react";
import { Zombies, type ZombieId } from "../game/zombies";
import { useGame } from "../game/useGame";

type Props = {
  width?: number;
  height?: number;
};

type AnimalInstance = {
  id: ZombieId;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type VisitorInstance = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifetime: number; // seconds remaining
};

type FloatingText = {
  x: number;
  y: number;
  text: string;
  life: number; // 0-1, decreases over time
};

const ANIMAL_SIZE = 48;
const VISITOR_SIZE = 24;
const SPEED = 10;
const VISITOR_SPEED = 20;
const VISITOR_MIN_LIFETIME = 15;
const VISITOR_MAX_LIFETIME = 30;

// Preload images
const imageCache: Record<string, HTMLImageElement> = {};

function getImage(id: ZombieId): HTMLImageElement | null {
  if (imageCache[id]) return imageCache[id];

  const img = new Image();
  img.src = Zombies[id].image;
  imageCache[id] = img;

  return img.complete ? img : null;
}

// Preload all images on module load
(Object.keys(Zombies) as ZombieId[]).forEach(id => {
  const img = new Image();
  img.src = Zombies[id].image;
  imageCache[id] = img;
});

export const ZooCanvas: React.FC<Props> = ({ width = 800, height = 360 }) => {
  const { state, collectBrain } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animalsRef = useRef<AnimalInstance[]>([]);
  const visitorsRef = useRef<VisitorInstance[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lastTimeRef = useRef<number>(0);
  const sizeRef = useRef({ W: 0, H: 0 });
  const clickPowerRef = useRef(state.clickPower);
  const lastMoneyRef = useRef(state.money);

  // Keep clickPower ref in sync
  useEffect(() => {
    clickPowerRef.current = state.clickPower;
  }, [state.clickPower]);

  // Spawn visitors when money increases
  useEffect(() => {
    const { W, H } = sizeRef.current;
    const moneyDiff = state.money - lastMoneyRef.current;
    lastMoneyRef.current = state.money;

    if (moneyDiff > 0) {
      // Each $5 = one visitor
      const visitorsToSpawn = Math.floor(moneyDiff / 5);
      for (let i = 0; i < visitorsToSpawn; i++) {
        const angle = Math.random() * Math.PI * 2;
        const lifetime =
          VISITOR_MIN_LIFETIME + Math.random() * (VISITOR_MAX_LIFETIME - VISITOR_MIN_LIFETIME);
        visitorsRef.current.push({
          x: VISITOR_SIZE + Math.random() * Math.max(1, W - VISITOR_SIZE * 2),
          y: VISITOR_SIZE + Math.random() * Math.max(1, H - VISITOR_SIZE * 2),
          vx: Math.cos(angle) * VISITOR_SPEED,
          vy: Math.sin(angle) * VISITOR_SPEED,
          lifetime
        });
      }
    }
  }, [state.money]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    collectBrain();

    // Add floating text
    floatingTextsRef.current.push({
      x,
      y,
      text: `+${clickPowerRef.current}`,
      life: 1
    });
  };

  // Sync animals when state changes (without restarting animation)
  useEffect(() => {
    const { W, H } = sizeRef.current;
    const existing = animalsRef.current;
    const newAnimals: AnimalInstance[] = [];

    (Object.keys(Zombies) as ZombieId[]).forEach(id => {
      const owned = state.generators[id]?.owned ?? 0;
      const maxDraw = Math.min(owned, 30);

      // Find existing animals of this type
      const existingOfType = existing.filter(a => a.id === id);

      for (let i = 0; i < maxDraw; i++) {
        if (existingOfType[i]) {
          // Keep existing animal
          newAnimals.push(existingOfType[i]);
        } else {
          // Create new animal at random position
          const angle = Math.random() * Math.PI * 2;
          newAnimals.push({
            id,
            x: ANIMAL_SIZE + Math.random() * Math.max(1, W - ANIMAL_SIZE * 2),
            y: ANIMAL_SIZE + Math.random() * Math.max(1, H - ANIMAL_SIZE * 2),
            vx: Math.cos(angle) * SPEED,
            vy: Math.sin(angle) * SPEED
          });
        }
      }
    });

    animalsRef.current = newAnimals;
  }, [state.generators]);

  // Animation loop - only runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current.W = rect.width;
      sizeRef.current.H = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function update(dt: number) {
      const { W, H } = sizeRef.current;
      const animals = animalsRef.current;
      const visitors = visitorsRef.current;
      const padding = 10;

      for (const animal of animals) {
        animal.x += animal.vx * dt;
        animal.y += animal.vy * dt;

        // Bounce off walls
        if (animal.x < padding) {
          animal.x = padding;
          animal.vx = Math.abs(animal.vx);
        }
        if (animal.x > W - ANIMAL_SIZE - padding) {
          animal.x = W - ANIMAL_SIZE - padding;
          animal.vx = -Math.abs(animal.vx);
        }
        if (animal.y < padding + 20) {
          animal.y = padding + 20;
          animal.vy = Math.abs(animal.vy);
        }
        if (animal.y > H - ANIMAL_SIZE - padding) {
          animal.y = H - ANIMAL_SIZE - padding;
          animal.vy = -Math.abs(animal.vy);
        }
      }

      // Update visitors
      for (const visitor of visitors) {
        visitor.x += visitor.vx * dt;
        visitor.y += visitor.vy * dt;
        visitor.lifetime -= dt;

        // Bounce off walls
        if (visitor.x < padding) {
          visitor.x = padding;
          visitor.vx = Math.abs(visitor.vx);
        }
        if (visitor.x > W - VISITOR_SIZE - padding) {
          visitor.x = W - VISITOR_SIZE - padding;
          visitor.vx = -Math.abs(visitor.vx);
        }
        if (visitor.y < padding + 20) {
          visitor.y = padding + 20;
          visitor.vy = Math.abs(visitor.vy);
        }
        if (visitor.y > H - VISITOR_SIZE - padding) {
          visitor.y = H - VISITOR_SIZE - padding;
          visitor.vy = -Math.abs(visitor.vy);
        }
      }
      // Remove expired visitors
      visitorsRef.current = visitors.filter(v => v.lifetime > 0);

      // Update floating texts
      const texts = floatingTextsRef.current;
      for (const text of texts) {
        text.life -= dt * 1.5; // Fade over ~0.67 seconds
        text.y -= dt * 40; // Float upward
      }
      // Remove dead texts
      floatingTextsRef.current = texts.filter(t => t.life > 0);
    }

    function draw() {
      const { W, H } = sizeRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0f0f12";
      ctx.fillRect(0, 0, W, H);

      // Draw animals
      for (const animal of animalsRef.current) {
        const img = getImage(animal.id);

        // Draw image or fallback circle
        if (img && img.complete) {
          ctx.drawImage(img, animal.x, animal.y, ANIMAL_SIZE, ANIMAL_SIZE);
        } else {
          // Fallback to colored circle
          ctx.fillStyle = Zombies[animal.id].color;
          ctx.beginPath();
          ctx.arc(animal.x + ANIMAL_SIZE / 2, animal.y + ANIMAL_SIZE / 2, ANIMAL_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw visitors
      for (const visitor of visitorsRef.current) {
        ctx.fillStyle = "#4ade80"; // Green color for visitors
        ctx.beginPath();
        ctx.arc(
          visitor.x + VISITOR_SIZE / 2,
          visitor.y + VISITOR_SIZE / 2,
          VISITOR_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Add a simple face
        ctx.fillStyle = "#1a1a1a";
        // Eyes
        ctx.beginPath();
        ctx.arc(visitor.x + VISITOR_SIZE * 0.35, visitor.y + VISITOR_SIZE * 0.4, 2, 0, Math.PI * 2);
        ctx.arc(visitor.x + VISITOR_SIZE * 0.65, visitor.y + VISITOR_SIZE * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(visitor.x + VISITOR_SIZE / 2, visitor.y + VISITOR_SIZE * 0.55, 4, 0, Math.PI);
        ctx.stroke();
      }

      // Draw floating texts
      for (const text of floatingTextsRef.current) {
        ctx.globalAlpha = text.life;
        ctx.fillStyle = "#f0a0d0";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text.text, text.x, text.y);
      }
      ctx.globalAlpha = 1;
    }

    function loop(time: number) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width, height }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#0f0f12",
          borderRadius: 10,
          cursor: "pointer"
        }}
      />
    </div>
  );
};
