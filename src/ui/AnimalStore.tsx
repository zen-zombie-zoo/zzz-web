//
// // src/ui/AnimalStore.tsx
// import React from 'react';
// import { Animals, type AnimalId } from '../game/animals';
// import { useGame } from '../game/GameContext';
// import { nextUnitCost } from '../game/economy';
//
// export const AnimalStore: React.FC = () => {
//   const { state, buyAnimal } = useGame();
//
//   return (
//     <div>
//       <h2>Animal Store</h2>
//       { (Object.keys(Animals) as AnimalId[]).map(id => {
//         const def = Animals[id];
//         const owned = state.generators[id]?.owned ?? 0;
//         const cost = nextUnitCost(def, owned);
//
//         // Unlocking based on cash threshold
//         // const unlocked = !def.unlockAt || gte(state.gold, def.unlockAt);
//
//         return (
//           <div key={id} className="row" style={{ opacity: unlocked ? 1 : 0.5 }}>
//             <div>
//               <div><strong>{def.name}</strong> <span className="small">(${fmt(def.baseProd)}/sec each)</span></div>
//               <div className="small">Owned: {owned}</div>
//             </div>
//             <div>
//               <button onClick={() => buyAnimal(id, 1)} disabled={!gte(state.gold, cost) || !unlocked}>
//                 Buy 1 (${fmt(cost)})
//               </button>{' '}
//               <button onClick={() => buyAnimal(id, 10)} disabled={!unlocked}>
//                 +10
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
