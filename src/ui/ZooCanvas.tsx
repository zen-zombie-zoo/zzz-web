import React, { useEffect, useRef } from "react";
import { Animals, type AnimalId } from "../game/animals";
import { useGame } from "../game/GameContext";

type Props = {
  width?: number;
  height?: number;
};

type AnimalInstance = {
  id: AnimalId;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const ANIMAL_SIZE = 48;
const SPEED = 10;

// Preload images
const imageCache: Record<string, HTMLImageElement> = {};

function getImage(id: AnimalId): HTMLImageElement | null {
  if (imageCache[id]) return imageCache[id];

  const img = new Image();
  img.src = Animals[id].image;
  imageCache[id] = img;

  return img.complete ? img : null;
}

// Preload all images on module load
(Object.keys(Animals) as AnimalId[]).forEach((id) => {
  const img = new Image();
  img.src = Animals[id].image;
  imageCache[id] = img;
});

export const ZooCanvas: React.FC<Props> = ({ width = 800, height = 360 }) => {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animalsRef = useRef<AnimalInstance[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const sizeRef = useRef({ W: 0, H: 0 });

  // Sync animals when state changes (without restarting animation)
  useEffect(() => {
    const { W, H } = sizeRef.current;
    const existing = animalsRef.current;
    const newAnimals: AnimalInstance[] = [];

    (Object.keys(Animals) as AnimalId[]).forEach((id) => {
      const owned = state.generators[id]?.owned ?? 0;
      const maxDraw = Math.min(owned, 30);

      // Find existing animals of this type
      const existingOfType = existing.filter((a) => a.id === id);

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
            vy: Math.sin(angle) * SPEED,
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
          ctx.fillStyle = Animals[animal.id].color;
          ctx.beginPath();
          ctx.arc(
            animal.x + ANIMAL_SIZE / 2,
            animal.y + ANIMAL_SIZE / 2,
            ANIMAL_SIZE / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }

    function loop(time: number) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
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
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#0f0f12",
          borderRadius: 10,
        }}
      />
    </div>
  );
};
