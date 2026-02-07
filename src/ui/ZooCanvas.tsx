import React, { useEffect, useRef } from "react";
import { Zombies, type ZombieId } from "../game/zombies";
import { useGame } from "../game/useGame";
import { MAX_MACHINE_LEVEL } from "../game/machine";
import { theme } from "../theme";
import "./ZooCanvas.css";

type Props = {
  width?: number;
  height?: number;
  onMachineClick?: () => void;
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
const MACHINE_SIZE = 64;
const MACHINE_PADDING = 20;

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

export const ZooCanvas: React.FC<Props> = ({ width = 800, height = 360, onMachineClick }) => {
  const { state, collectBrain } = useGame();
  const machineLevelRef = useRef(state.machineLevel);
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

  // Keep machineLevel ref in sync
  useEffect(() => {
    machineLevelRef.current = state.machineLevel;
  }, [state.machineLevel]);

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
    const { W, H } = sizeRef.current;

    // Check if click is on the machine (bottom-right corner)
    const machineX = W - MACHINE_SIZE - MACHINE_PADDING;
    const machineY = H - MACHINE_SIZE - MACHINE_PADDING;
    if (x >= machineX && x <= machineX + MACHINE_SIZE && y >= machineY && y <= machineY + MACHINE_SIZE) {
      onMachineClick?.();
      return;
    }

    // Check if click is on a visitor
    const visitors = visitorsRef.current;
    let clickedVisitorIndex = -1;

    for (let i = 0; i < visitors.length; i++) {
      const visitor = visitors[i];
      const centerX = visitor.x + VISITOR_SIZE / 2;
      const centerY = visitor.y + VISITOR_SIZE / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance <= VISITOR_SIZE / 2) {
        clickedVisitorIndex = i;
        break;
      }
    }

    // Only collect brain if a visitor was clicked
    if (clickedVisitorIndex !== -1) {
      const visitor = visitors[clickedVisitorIndex];
      collectBrain();

      // Add floating text at visitor position
      floatingTextsRef.current.push({
        x: visitor.x + VISITOR_SIZE / 2,
        y: visitor.y,
        text: `+${clickPowerRef.current}`,
        life: 1
      });

      // Remove the clicked visitor
      visitorsRef.current.splice(clickedVisitorIndex, 1);
    }
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
      ctx.fillStyle = theme.bg;
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
        ctx.fillStyle = theme.colorVisitor;
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
        ctx.fillStyle = theme.colorVisitorFace;
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
        ctx.fillStyle = theme.colorFloatingText;
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text.text, text.x, text.y);
      }
      ctx.globalAlpha = 1;

      // Draw machine in bottom-right corner
      const machineX = W - MACHINE_SIZE - MACHINE_PADDING;
      const machineY = H - MACHINE_SIZE - MACHINE_PADDING;
      const level = machineLevelRef.current;
      const isMaxed = level >= MAX_MACHINE_LEVEL;

      // Machine body
      ctx.fillStyle = isMaxed ? theme.colorSuccess : theme.colorPrimary;
      ctx.beginPath();
      ctx.roundRect(machineX, machineY, MACHINE_SIZE, MACHINE_SIZE, 8);
      ctx.fill();

      // Machine border
      ctx.strokeStyle = isMaxed ? theme.colorSuccessLight : theme.colorPrimaryLight;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Level indicator dots
      const dotSize = 6;
      const dotSpacing = 12;
      const totalDotsWidth = MAX_MACHINE_LEVEL * dotSize + (MAX_MACHINE_LEVEL - 1) * (dotSpacing - dotSize);
      const dotsStartX = machineX + (MACHINE_SIZE - totalDotsWidth) / 2;
      const dotsY = machineY + MACHINE_SIZE - 14;

      for (let i = 0; i < MAX_MACHINE_LEVEL; i++) {
        ctx.beginPath();
        ctx.arc(dotsStartX + i * dotSpacing + dotSize / 2, dotsY, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = i < level ? theme.colorWarning : theme.colorInactive;
        ctx.fill();
      }

      // Machine icon (gear-like)
      const centerX = machineX + MACHINE_SIZE / 2;
      const centerY = machineY + MACHINE_SIZE / 2 - 6;
      ctx.fillStyle = theme.colorGear;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isMaxed ? theme.colorSuccess : theme.colorPrimary;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw gear teeth
      ctx.fillStyle = theme.colorGear;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const toothX = centerX + Math.cos(angle) * 16;
        const toothY = centerY + Math.sin(angle) * 16;
        ctx.beginPath();
        ctx.arc(toothX, toothY, 4, 0, Math.PI * 2);
        ctx.fill();
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
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width, height }}>
      <canvas ref={canvasRef} onClick={handleClick} className="zoo-canvas" />
    </div>
  );
};
