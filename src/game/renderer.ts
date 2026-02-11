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
export function drawZombie(ctx: CanvasRenderingContext2D, id: ZombieId, x: number, y: number): void {
  const img = getImage(id);

  if (img && img.complete) {
    ctx.drawImage(img, x, y, ZOMBIE_SIZE, ZOMBIE_SIZE);
  } else {
    // Fallback circle if image not loaded
    ctx.fillStyle = Zombies[id].color;
    ctx.beginPath();
    ctx.arc(x + ZOMBIE_SIZE / 2, y + ZOMBIE_SIZE / 2, ZOMBIE_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draws a visitor with a simple face
 */
export function drawVisitor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Body
  ctx.fillStyle = theme.colorVisitor;
  ctx.beginPath();
  ctx.arc(x + VISITOR_SIZE / 2, y + VISITOR_SIZE / 2, VISITOR_SIZE / 2, 0, Math.PI * 2);
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
export function drawFloatingText(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, alpha: number): void {
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
export function drawMachine(ctx: CanvasRenderingContext2D, x: number, y: number, level: number): void {
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
  const totalDotsWidth = MAX_MACHINE_LEVEL * dotSize + (MAX_MACHINE_LEVEL - 1) * (dotSpacing - dotSize);
  const dotsStartX = x + (MACHINE_SIZE - totalDotsWidth) / 2;
  const dotsY = y + MACHINE_SIZE - 14;

  for (let i = 0; i < MAX_MACHINE_LEVEL; i++) {
    ctx.beginPath();
    ctx.arc(dotsStartX + i * dotSpacing + dotSize / 2, dotsY, dotSize / 2, 0, Math.PI * 2);
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

// Gate dimensions
export const GATE_WIDTH = 80;
export const GATE_HEIGHT = 50;

/**
 * Draws the zoo gate at the specified position
 */
export function drawGate(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const postWidth = 10;
  const archHeight = 18;

  // Gate posts with gradient effect
  const postGradient = ctx.createLinearGradient(x, y, x + postWidth, y);
  postGradient.addColorStop(0, theme.colorInactive);
  postGradient.addColorStop(0.5, theme.colorGear);
  postGradient.addColorStop(1, theme.colorInactive);

  ctx.fillStyle = postGradient;
  ctx.fillRect(x, y + archHeight - 4, postWidth, GATE_HEIGHT - archHeight + 4);
  ctx.fillRect(x + GATE_WIDTH - postWidth, y + archHeight - 4, postWidth, GATE_HEIGHT - archHeight + 4);

  // Decorative post caps
  ctx.fillStyle = theme.colorAccent;
  ctx.beginPath();
  ctx.arc(x + postWidth / 2, y + archHeight - 4, 6, 0, Math.PI * 2);
  ctx.arc(x + GATE_WIDTH - postWidth / 2, y + archHeight - 4, 6, 0, Math.PI * 2);
  ctx.fill();

  // Main arch
  ctx.beginPath();
  ctx.moveTo(x + postWidth / 2, y + archHeight);
  ctx.quadraticCurveTo(x + GATE_WIDTH / 2, y - 2, x + GATE_WIDTH - postWidth / 2, y + archHeight);
  ctx.lineWidth = 5;
  ctx.strokeStyle = theme.colorGear;
  ctx.stroke();

  // Inner arch
  ctx.beginPath();
  ctx.moveTo(x + postWidth + 4, y + archHeight + 2);
  ctx.quadraticCurveTo(x + GATE_WIDTH / 2, y + 6, x + GATE_WIDTH - postWidth - 4, y + archHeight + 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.colorInactive;
  ctx.stroke();

  // Gate bars
  ctx.strokeStyle = theme.colorInactive;
  ctx.lineWidth = 2;
  const barCount = 5;
  for (let i = 1; i < barCount; i++) {
    const barX = x + postWidth + ((GATE_WIDTH - postWidth * 2) * i) / barCount;
    const archY = y + archHeight + 2 - Math.sin((i / barCount) * Math.PI) * (archHeight - 8);
    ctx.beginPath();
    ctx.moveTo(barX, archY);
    ctx.lineTo(barX, y + GATE_HEIGHT);
    ctx.stroke();
  }

  // Bottom bar
  ctx.beginPath();
  ctx.moveTo(x + postWidth, y + GATE_HEIGHT - 2);
  ctx.lineTo(x + GATE_WIDTH - postWidth, y + GATE_HEIGHT - 2);
  ctx.strokeStyle = theme.colorGear;
  ctx.lineWidth = 3;
  ctx.stroke();

  // "ZOO" text on arch
  ctx.fillStyle = theme.colorAccent;
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ZOO", x + GATE_WIDTH / 2, y + 14);
}

/**
 * Clears and fills the canvas background
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);
}
