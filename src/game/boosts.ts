export interface BoostDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  duration: number; // seconds
  effect: {
    type: "production" | "visitors" | "clicks";
    multiplier: number;
  };
}

export interface ActiveBoost {
  id: string;
  expiresAt: number; // timestamp
}

export const BOOSTS: BoostDef[] = [
  {
    id: "brain_surge",
    name: "Brain Surge",
    description: "2x brain production for 60 seconds",
    icon: "🧠",
    cost: 100,
    duration: 60,
    effect: { type: "production", multiplier: 2 }
  },
  {
    id: "grand_opening",
    name: "Grand Opening",
    description: "3x visitor rate for 45 seconds",
    icon: "🎉",
    cost: 200,
    duration: 45,
    effect: { type: "visitors", multiplier: 3 }
  },
  {
    id: "click_frenzy",
    name: "Click Frenzy",
    description: "5x click power for 30 seconds",
    icon: "👆",
    cost: 75,
    duration: 30,
    effect: { type: "clicks", multiplier: 5 }
  },
  {
    id: "mega_boost",
    name: "Mega Boost",
    description: "2x everything for 90 seconds",
    icon: "⚡",
    cost: 500,
    duration: 90,
    effect: { type: "production", multiplier: 2 } // We'll handle this specially
  }
];

export const MEGA_BOOST_ID = "mega_boost";

export function getBoostById(id: string): BoostDef | undefined {
  return BOOSTS.find(b => b.id === id);
}

export function isBoostActive(activeBoosts: ActiveBoost[], boostId: string): boolean {
  const now = Date.now();
  return activeBoosts.some(b => b.id === boostId && b.expiresAt > now);
}

export function getActiveBoostMultipliers(activeBoosts: ActiveBoost[]): {
  productionMultiplier: number;
  visitorMultiplier: number;
  clickMultiplier: number;
} {
  const now = Date.now();
  let productionMultiplier = 1;
  let visitorMultiplier = 1;
  let clickMultiplier = 1;

  for (const active of activeBoosts) {
    if (active.expiresAt <= now) continue;

    const boost = getBoostById(active.id);
    if (!boost) continue;

    // Mega boost affects everything
    if (active.id === MEGA_BOOST_ID) {
      productionMultiplier *= 2;
      visitorMultiplier *= 2;
      clickMultiplier *= 2;
      continue;
    }

    switch (boost.effect.type) {
      case "production":
        productionMultiplier *= boost.effect.multiplier;
        break;
      case "visitors":
        visitorMultiplier *= boost.effect.multiplier;
        break;
      case "clicks":
        clickMultiplier *= boost.effect.multiplier;
        break;
    }
  }

  return { productionMultiplier, visitorMultiplier, clickMultiplier };
}

export function cleanExpiredBoosts(activeBoosts: ActiveBoost[]): ActiveBoost[] {
  const now = Date.now();
  return activeBoosts.filter(b => b.expiresAt > now);
}

export function getRemainingTime(activeBoosts: ActiveBoost[], boostId: string): number {
  const now = Date.now();
  const boost = activeBoosts.find(b => b.id === boostId && b.expiresAt > now);
  return boost ? Math.max(0, Math.ceil((boost.expiresAt - now) / 1000)) : 0;
}
