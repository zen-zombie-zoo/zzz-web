
// src/game/animals.ts

export const Animals = {
  monkey: {
    id: 'monkey',
    name: 'Monkey',
    color: '#f59e0b',
    baseCost: 10,
    costGrowth: 1.15,
    baseProd: 1,
    unlockAt: 0,
  },
  giraffe: {
    id: 'giraffe',
    name: 'Giraffe',
    color: '#a78bfa',
    baseCost: 150,
    costGrowth: 1.15,
    baseProd: 8,
    unlockAt: 100,
  },
  penguin: {
    id: 'penguin',
    name: 'Penguin',
    color: '#60a5fa',
    baseCost: 1500,
    costGrowth: 1.15,
    baseProd: 50,
    unlockAt: 1000,
  },
  lion: {
    id: 'lion',
    name: 'Lion',
    color: '#ef4444',
    baseCost: 7500,
    costGrowth: 1.15,
    baseProd: 200,
    unlockAt: 5000,
  },
} as const;

export type AnimalId = keyof typeof Animals;
export type AnimalDefs = typeof Animals;
