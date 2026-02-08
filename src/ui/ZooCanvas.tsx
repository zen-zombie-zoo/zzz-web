import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Zombies, type ZombieId } from "../game/zombies";
import { useGame } from "../game/useGame";
import { theme } from "../theme"; // Used for styled components
import {
  type Entity,
  ZOMBIE_SPEED,
  VISITOR_SPEED,
  createCardinalVelocity,
  updateZombieMovement,
  updateVisitorMovement,
} from "../game/movement";
import {
  ZOMBIE_SIZE,
  VISITOR_SIZE,
  MACHINE_SIZE,
  MACHINE_PADDING,
  drawZombie,
  drawVisitor,
  drawFloatingText,
  drawMachine,
  clearCanvas,
} from "../game/renderer";

type Props = {
  onMachineClick?: () => void;
};

type ZombieInstance = Entity & {
  id: ZombieId;
};

type VisitorInstance = Entity & {
  lifetime: number;
};

type FloatingText = {
  x: number;
  y: number;
  text: string;
  life: number;
};

const VISITOR_MIN_LIFETIME = 15;
const VISITOR_MAX_LIFETIME = 30;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${theme.spacingLg};
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  background: ${theme.bg};
  border-radius: ${theme.radiusXl};
  cursor: pointer;
  box-shadow: ${theme.shadowLg}, inset 0 0 0 1px ${theme.borderSubtle};
  transition: box-shadow ${theme.transitionNormal};

  &:hover {
    box-shadow: ${theme.shadowLg}, inset 0 0 0 1px ${theme.borderDefault};
  }
`;

export const ZooCanvas: React.FC<Props> = ({ onMachineClick }) => {
  const { state, collectBrain } = useGame();
  const machineLevelRef = useRef(state.machineLevel);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const zombiesRef = useRef<ZombieInstance[]>([]);
  const visitorsRef = useRef<VisitorInstance[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const lastTimeRef = useRef<number>(0);
  const sizeRef = useRef({ W: 0, H: 0 });
  const clickPowerRef = useRef(state.clickPower);
  const lastMoneyRef = useRef(state.money);

  useEffect(() => {
    clickPowerRef.current = state.clickPower;
  }, [state.clickPower]);

  useEffect(() => {
    machineLevelRef.current = state.machineLevel;
  }, [state.machineLevel]);

  useEffect(() => {
    const { W, H } = sizeRef.current;
    const moneyDiff = state.money - lastMoneyRef.current;
    lastMoneyRef.current = state.money;

    if (moneyDiff > 0) {
      const visitorsToSpawn = Math.floor(moneyDiff / 5);
      for (let i = 0; i < visitorsToSpawn; i++) {
        const angle = Math.random() * Math.PI * 2;
        const lifetime =
          VISITOR_MIN_LIFETIME +
          Math.random() * (VISITOR_MAX_LIFETIME - VISITOR_MIN_LIFETIME);
        visitorsRef.current.push({
          x: VISITOR_SIZE + Math.random() * Math.max(1, W - VISITOR_SIZE * 2),
          y: VISITOR_SIZE + Math.random() * Math.max(1, H - VISITOR_SIZE * 2),
          vx: Math.cos(angle) * VISITOR_SPEED,
          vy: Math.sin(angle) * VISITOR_SPEED,
          lifetime,
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

    const machineX = W - MACHINE_SIZE - MACHINE_PADDING;
    const machineY = H - MACHINE_SIZE - MACHINE_PADDING;
    if (
      x >= machineX &&
      x <= machineX + MACHINE_SIZE &&
      y >= machineY &&
      y <= machineY + MACHINE_SIZE
    ) {
      onMachineClick?.();
      return;
    }

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

    if (clickedVisitorIndex !== -1) {
      const visitor = visitors[clickedVisitorIndex];
      collectBrain();

      floatingTextsRef.current.push({
        x: visitor.x + VISITOR_SIZE / 2,
        y: visitor.y,
        text: `+${clickPowerRef.current}`,
        life: 1,
      });

      visitorsRef.current.splice(clickedVisitorIndex, 1);
    }
  };

  useEffect(() => {
    const { W, H } = sizeRef.current;
    const existing = zombiesRef.current;
    const newZombies: ZombieInstance[] = [];

    (Object.keys(Zombies) as ZombieId[]).forEach(id => {
      const owned = state.generators[id]?.owned ?? 0;
      const maxDraw = Math.min(owned, 30);

      const existingOfType = existing.filter(z => z.id === id);

      for (let i = 0; i < maxDraw; i++) {
        if (existingOfType[i]) {
          newZombies.push(existingOfType[i]);
        } else {
          const velocity = createCardinalVelocity(ZOMBIE_SPEED);
          newZombies.push({
            id,
            x: ZOMBIE_SIZE + Math.random() * Math.max(1, W - ZOMBIE_SIZE * 2),
            y: ZOMBIE_SIZE + Math.random() * Math.max(1, H - ZOMBIE_SIZE * 2),
            ...velocity,
          });
        }
      }
    });

    zombiesRef.current = newZombies;
  }, [state.generators]);

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
      const zombies = zombiesRef.current;
      const visitors = visitorsRef.current;
      const bounds = { width: W, height: H, padding: 10, topPadding: 30 };

      for (const zombie of zombies) {
        updateZombieMovement(zombie, bounds, ZOMBIE_SIZE, dt);
      }

      for (const visitor of visitors) {
        updateVisitorMovement(visitor, bounds, VISITOR_SIZE, dt);
        visitor.lifetime -= dt;
      }
      visitorsRef.current = visitors.filter(v => v.lifetime > 0);

      const texts = floatingTextsRef.current;
      for (const text of texts) {
        text.life -= dt * 1.5;
        text.y -= dt * 40;
      }
      floatingTextsRef.current = texts.filter(t => t.life > 0);
    }

    function draw() {
      const { W, H } = sizeRef.current;
      clearCanvas(ctx, W, H);

      for (const zombie of zombiesRef.current) {
        drawZombie(ctx, zombie.id, zombie.x, zombie.y);
      }

      for (const visitor of visitorsRef.current) {
        drawVisitor(ctx, visitor.x, visitor.y);
      }

      for (const text of floatingTextsRef.current) {
        drawFloatingText(ctx, text.x, text.y, text.text, text.life);
      }

      const machineX = W - MACHINE_SIZE - MACHINE_PADDING;
      const machineY = H - MACHINE_SIZE - MACHINE_PADDING;
      drawMachine(ctx, machineX, machineY, machineLevelRef.current);
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
    <Wrapper>
      <Canvas ref={canvasRef} onClick={handleClick} />
    </Wrapper>
  );
};
