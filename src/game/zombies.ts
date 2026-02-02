import monkeyImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/monkey.png";
import giraffeImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/giraffe.png";
import penguinImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/penguin.png";
import elephantImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/elephant.png";

export const Zombies = {
  monkey: {
    id: "monkey",
    name: "Monkey",
    color: "#f59e0b",
    image: monkeyImg,
    baseCost: 10,
    costGrowth: 1.15,
    baseProd: 1,
    unlockAt: 0,
  },
  giraffe: {
    id: "giraffe",
    name: "Giraffe",
    color: "#a78bfa",
    image: giraffeImg,
    baseCost: 150,
    costGrowth: 1.15,
    baseProd: 8,
    unlockAt: 100,
  },
  penguin: {
    id: "penguin",
    name: "Penguin",
    color: "#60a5fa",
    image: penguinImg,
    baseCost: 1500,
    costGrowth: 1.15,
    baseProd: 50,
    unlockAt: 1000,
  },
  elephant: {
    id: "elephant",
    name: "Elephant",
    color: "#ef4444",
    image: elephantImg,
    baseCost: 7500,
    costGrowth: 1.15,
    baseProd: 200,
    unlockAt: 5000,
  },
} as const;

export type ZombieId = keyof typeof Zombies;
export type ZombieDefs = typeof Zombies;
