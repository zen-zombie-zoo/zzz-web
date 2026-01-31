
import { n, mul } from './numbers';
import type { UpgradeDef } from './types';

export const Upgrades: UpgradeDef[] = [
  {
    id: 'double_miner',
    name: 'Stronger Picks',
    desc: 'Doubles Miner production.',
    cost: n(100),
    apply: (s) => {
      s.multipliers.miner = mul(s.multipliers.miner, 2);
    },
  },
  {
    id: 'better_drill',
    name: 'Better Drill Bits',
    desc: 'Global production +50%',
    cost: n(750),
    apply: (s) => {
      s.multipliers.gold = mul(s.multipliers.gold, 1.5);
    },
  },
];
