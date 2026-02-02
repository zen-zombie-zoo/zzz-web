import Decimal from 'decimal.js';
import type { GameState } from './types';

const KEY = 'idle.save.v1';

function reviveDecimal(obj: any): any {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const v = (obj as any)[k];
      if (v && typeof v === 'object' && v.$decimal) {
        (obj as any)[k] = new Decimal(v.$decimal);
      } else {
        reviveDecimal(v);
      }
    }
  }
  return obj;
}

function replacer(_: string, value: any) {
  // Serialize Decimal.js values safely
  if (value && value.constructor && value.constructor.name === 'Decimal') {
    return { $decimal: value.toString() };
  }
  return value;
}

export function save(state: GameState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function load(): GameState | null {
  const s = localStorage.getItem(KEY);
  if (!s) return null;
  return JSON.parse(s);
}


export function wipeSave() {
  console.log("wiping")
  localStorage.removeItem(KEY);
}

export function computeOfflineSeconds(lastSavedAt: number): number {
  const now = Date.now();
  const seconds = Math.floor((now - lastSavedAt) / 1000);
  // clamp offline progress to 8 hours for sanity (tune as you like)
  return Math.max(0, Math.min(seconds, 8 * 3600));
}
