
// src/ui/ZooCanvas.tsx
import React, { useEffect, useRef } from 'react';
import { Animals, type AnimalId } from '../game/animals';
import { useGame } from '../game/GameContext';

type Props = {
  height?: number; // CSS pixels (logical)
};

export const ZooCanvas: React.FC<Props> = ({ height = 360 }) => {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f0f12';
      ctx.fillRect(0, 0, W, H);

      // Grid layout for animal boxes
      const boxW = 110;
      const boxH = 60;
      const gap = 10;
      const cols = Math.max(1, Math.floor((W - gap) / (boxW + gap)));

      // Build a flat list of "instances" to draw
      type Item = { color: string; label: string };
      const items: Item[] = [];
      (Object.keys(Animals) as AnimalId[]).forEach(id => {
        const owned = state.generators[id]?.owned ?? 0;
        const def = Animals[id];
        // Cap drawn instances to prevent overload (show count badge instead)
        const maxDraw = Math.min(owned, 50);
        for (let i = 0; i < maxDraw; i++) {
          items.push({ color: def.color, label: def.name });
        }
        // If we have more than maxDraw, add a "stack" indicator tile
        if (owned > maxDraw) {
          items.push({ color: def.color, label: `${def.name} x${owned - maxDraw + 1}` });
        }
      });

      // Draw items
      ctx.textBaseline = 'middle';
      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Arial';

      items.forEach((it, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = gap + col * (boxW + gap);
        const y = gap + row * (boxH + gap);

        if (y + boxH + gap > H) return; // clip if overflow

        // Box
        ctx.fillStyle = it.color;
        roundRect(ctx, x, y, boxW, boxH, 8, true, false);

        // Label
        ctx.fillStyle = '#0f0f12';
        ctx.fillText(it.label, x + 10, y + boxH / 2);
      });

      // Title overlay
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, Arial';
      ctx.fillText('Your Zoo', 10, 18);
    }

    function loop() {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    loop();

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [state]);

  return (
    <div style={{ width: '100%', height }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: '#0f0f12' }} />
    </div>
  );
};

/** Utility to draw rounded rects */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
  fill = true, stroke = false
) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
