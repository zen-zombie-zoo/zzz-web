import { Zombies, type ZombieId } from "./zombies";
import { MAX_MACHINE_LEVEL } from "./machine";
import { theme } from "../theme";

// Entity sizes
export const ZOMBIE_SIZE = 48;
export const VISITOR_SIZE = 24;
export const MACHINE_SIZE = 64;
export const MACHINE_PADDING = 20;

// Image cache for zombie sprites
const imageCache: Record<string, HTMLImageElement> = {};

function getImage(id: ZombieId): HTMLImageElement | null {
  if (imageCache[id]) return imageCache[id];

  const img = new Image();
  img.src = Zombies[id].image;
  imageCache[id] = img;

  return img.complete ? img : null;
}

// Preload all zombie images
(Object.keys(Zombies) as ZombieId[]).forEach(id => {
  const img = new Image();
  img.src = Zombies[id].image;
  imageCache[id] = img;
});

/**
 * Draws a zombie on the canvas
 */
export function drawZombie(
  ctx: CanvasRenderingContext2D,
  id: ZombieId,
  x: number,
  y: number
): void {
  const img = getImage(id);

  if (img && img.complete) {
    ctx.drawImage(img, x, y, ZOMBIE_SIZE, ZOMBIE_SIZE);
  } else {
    // Fallback circle if image not loaded
    ctx.fillStyle = Zombies[id].color;
    ctx.beginPath();
    ctx.arc(
      x + ZOMBIE_SIZE / 2,
      y + ZOMBIE_SIZE / 2,
      ZOMBIE_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

/**
 * Draws a visitor with a simple face
 */
export function drawVisitor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  // Body
  ctx.fillStyle = theme.colorVisitor;
  ctx.beginPath();
  ctx.arc(
    x + VISITOR_SIZE / 2,
    y + VISITOR_SIZE / 2,
    VISITOR_SIZE / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Eyes
  ctx.fillStyle = theme.colorVisitorFace;
  ctx.beginPath();
  ctx.arc(x + VISITOR_SIZE * 0.35, y + VISITOR_SIZE * 0.4, 2, 0, Math.PI * 2);
  ctx.arc(x + VISITOR_SIZE * 0.65, y + VISITOR_SIZE * 0.4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(x + VISITOR_SIZE / 2, y + VISITOR_SIZE * 0.55, 4, 0, Math.PI);
  ctx.stroke();
}

/**
 * Draws floating text with fade effect
 */
export function drawFloatingText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  alpha: number
): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = theme.colorFloatingText;
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}

/**
 * Draws the machine with gear icon and level indicator
 */
export function drawMachine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void {
  const isMaxed = level >= MAX_MACHINE_LEVEL;

  // Machine body
  ctx.fillStyle = isMaxed ? theme.colorSuccess : theme.colorPrimary;
  ctx.beginPath();
  ctx.roundRect(x, y, MACHINE_SIZE, MACHINE_SIZE, 8);
  ctx.fill();

  // Border
  ctx.strokeStyle = isMaxed ? theme.colorSuccessLight : theme.colorPrimaryLight;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Level indicator dots
  const dotSize = 6;
  const dotSpacing = 12;
  const totalDotsWidth =
    MAX_MACHINE_LEVEL * dotSize + (MAX_MACHINE_LEVEL - 1) * (dotSpacing - dotSize);
  const dotsStartX = x + (MACHINE_SIZE - totalDotsWidth) / 2;
  const dotsY = y + MACHINE_SIZE - 14;

  for (let i = 0; i < MAX_MACHINE_LEVEL; i++) {
    ctx.beginPath();
    ctx.arc(
      dotsStartX + i * dotSpacing + dotSize / 2,
      dotsY,
      dotSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = i < level ? theme.colorWarning : theme.colorInactive;
    ctx.fill();
  }

  // Gear icon
  const centerX = x + MACHINE_SIZE / 2;
  const centerY = y + MACHINE_SIZE / 2 - 6;

  // Outer circle
  ctx.fillStyle = theme.colorGear;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle
  ctx.fillStyle = isMaxed ? theme.colorSuccess : theme.colorPrimary;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Gear teeth
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

/**
 * Clears and fills the canvas background
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);
}
