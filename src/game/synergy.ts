import type { GameState } from "./types";
import type { ZombieId } from "./zombies";
import { Zombies } from "./zombies";

export interface Synergy {
  id: string;
  name: string;
  description: string;
  icon: string;
  requires: { id: ZombieId; count: number }[];
  bonus: {
    type: "production" | "visitors" | "global";
    multiplier: number;
  };
}

export const SYNERGIES: Synergy[] = [
  {
    id: "office_team",
    name: "Office Team",
    description: "Office workers and teachers work together",
    icon: "💼",
    requires: [
      { id: Zombies.officerWorker.id, count: 5 },
      { id: Zombies.teacher.id, count: 5 }
    ],
    bonus: { type: "production", multiplier: 1.25 }
  },
  {
    id: "arctic_exhibit",
    name: "Arctic Exhibit",
    description: "Penguins, narwhals, and walruses thrive together",
    icon: "❄️",
    requires: [
      { id: Zombies.penguin.id, count: 3 },
      { id: Zombies.narwhal.id, count: 1 },
      { id: Zombies.walrus.id, count: 1 }
    ],
    bonus: { type: "visitors", multiplier: 1.5 }
  },
  {
    id: "safari_zone",
    name: "Safari Zone",
    description: "African animals draw crowds",
    icon: "🌍",
    requires: [
      { id: Zombies.elephant.id, count: 3 },
      { id: Zombies.crocodile.id, count: 3 },
      { id: Zombies.zebra.id, count: 1 }
    ],
    bonus: { type: "visitors", multiplier: 1.75 }
  },
  {
    id: "mighty_beasts",
    name: "Mighty Beasts",
    description: "Large animals produce more brains",
    icon: "💪",
    requires: [
      { id: Zombies.gorilla.id, count: 5 },
      { id: Zombies.rhino.id, count: 3 },
      { id: Zombies.elephant.id, count: 5 }
    ],
    bonus: { type: "production", multiplier: 1.5 }
  },
  {
    id: "ocean_world",
    name: "Ocean World",
    description: "Marine life spectacle",
    icon: "🌊",
    requires: [
      { id: Zombies.narwhal.id, count: 3 },
      { id: Zombies.walrus.id, count: 3 },
      { id: Zombies.whale.id, count: 1 }
    ],
    bonus: { type: "global", multiplier: 1.5 }
  },
  {
    id: "full_zoo",
    name: "Complete Collection",
    description: "Own every type of zombie",
    icon: "🏆",
    requires: Object.keys(Zombies).map(id => ({ id: id as ZombieId, count: 1 })),
    bonus: { type: "global", multiplier: 2.0 }
  }
];

export function getActiveSynergies(state: GameState): Synergy[] {
  return SYNERGIES.filter(synergy => {
    return synergy.requires.every(req => {
      const owned = state.generators[req.id]?.owned ?? 0;
      return owned >= req.count;
    });
  });
}

export function getSynergyBonuses(state: GameState): {
  productionMultiplier: number;
  visitorMultiplier: number;
  globalMultiplier: number;
} {
  const active = getActiveSynergies(state);

  let productionMultiplier = 1;
  let visitorMultiplier = 1;
  let globalMultiplier = 1;

  for (const synergy of active) {
    switch (synergy.bonus.type) {
      case "production":
        productionMultiplier *= synergy.bonus.multiplier;
        break;
      case "visitors":
        visitorMultiplier *= synergy.bonus.multiplier;
        break;
      case "global":
        globalMultiplier *= synergy.bonus.multiplier;
        break;
    }
  }

  return { productionMultiplier, visitorMultiplier, globalMultiplier };
}
