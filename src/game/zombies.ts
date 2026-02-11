import officeWorkerImg from "../assets/zombies/office-zombie.svg";
import teacherImg from "../assets/zombies/teacher-zombie.svg";
import penguinImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/penguin.png";
import elephantImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/elephant.png";
import crocodileImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/crocodile.png";
import gorillaImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/gorilla.png";
import mooseImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/moose.png";
import rhinoImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/rhino.png";
import narwhalImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/narwhal.png";
import walrusImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/walrus.png";
import zebraImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/zebra.png";
import whaleImg from "../assets/kenney_animal-pack-redux/PNG/Round without details/whale.png";

export const Zombies = {
  officerWorker: {
    id: "officerWorker",
    name: "Office Worker",
    color: "#f59e0b",
    image: officeWorkerImg,
    baseCost: 25,
    costGrowth: 1.4,
    baseProd: 0.5,
    unlockAt: 0
  },
  teacher: {
    id: "teacher",
    name: "Teacher",
    color: "#a78bfa",
    image: teacherImg,
    baseCost: 400,
    costGrowth: 1.6,
    baseProd: 5,
    unlockAt: 250
  },
  penguin: {
    id: "penguin",
    name: "Penguin",
    color: "#60a5fa",
    image: penguinImg,
    baseCost: 4000,
    costGrowth: 1.85,
    baseProd: 25,
    unlockAt: 2500
  },
  elephant: {
    id: "elephant",
    name: "Elephant",
    color: "#ef4444",
    image: elephantImg,
    baseCost: 20000,
    costGrowth: 2.2,
    baseProd: 100,
    unlockAt: 12000
  },
  crocodile: {
    id: "crocodile",
    name: "Crocodile",
    color: "#22c55e",
    image: crocodileImg,
    baseCost: 100000,
    costGrowth: 2.5,
    baseProd: 500,
    unlockAt: 50000
  },
  gorilla: {
    id: "gorilla",
    name: "Gorilla",
    color: "#8b5cf6",
    image: gorillaImg,
    baseCost: 1000000,
    costGrowth: 3.0,
    baseProd: 2500,
    unlockAt: 250000
  },
  moose: {
    id: "moose",
    name: "Moose",
    color: "#16a34a",
    image: mooseImg,
    baseCost: 5000000,
    costGrowth: 3.5,
    baseProd: 10000,
    unlockAt: 1000000
  },
  rhino: {
    id: "rhino",
    name: "Rhino",
    color: "#db2777",
    image: rhinoImg,
    baseCost: 25000000,
    costGrowth: 4.0,
    baseProd: 50000,
    unlockAt: 5000000
  },
  narwhal: {
    id: "narwhal",
    name: "Narwhal",
    color: "#2563eb",
    image: narwhalImg,
    baseCost: 100000000,
    costGrowth: 4.5,
    baseProd: 250000,
    unlockAt: 25000000
  },
  walrus: {
    id: "walrus",
    name: "Walrus",
    color: "#e11d48",
    image: walrusImg,
    baseCost: 500000000,
    costGrowth: 5.0,
    baseProd: 1000000,
    unlockAt: 100000000
  },
  zebra: {
    id: "zebra",
    name: "Zebra",
    color: "#64748b",
    image: zebraImg,
    baseCost: 2500000000,
    costGrowth: 5.5,
    baseProd: 5000000,
    unlockAt: 500000000
  },
  whale: {
    id: "whale",
    name: "Whale",
    color: "#1e40af",
    image: whaleImg,
    baseCost: 10000000000,
    costGrowth: 6.0,
    baseProd: 25000000,
    unlockAt: 2500000000
  }
} as const;

export type ZombieId = keyof typeof Zombies;
export type ZombieDefs = typeof Zombies;
