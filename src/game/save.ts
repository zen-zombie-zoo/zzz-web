import type { GameState } from "./types";

const KEY = "idle.save.v1";
let saveDisabled = false;

export function save(state: GameState) {
  if (saveDisabled) return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function load(): GameState | null {
  const s = localStorage.getItem(KEY);
  if (!s) return null;
  return JSON.parse(s);
}

export function wipeSave() {
  saveDisabled = true; // Prevent beforeunload from saving
  localStorage.removeItem(KEY);
}

export function computeOfflineSeconds(lastSavedAt: number): number {
  const now = Date.now();
  const seconds = Math.floor((now - lastSavedAt) / 1000);
  // clamp offline progress to 8 hours for sanity
  return Math.max(0, Math.min(seconds, 8 * 3600));
}
