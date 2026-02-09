# Zen Zombie Zoo

An idle game where you grow a zombie collection to earn brains. Built with React, TypeScript, and HTML Canvas.

## Features

- **Zombie Collection** - Buy different types of zombies that produce brains over time
- **Unlockable Tiers** - New zombie types unlock as you earn more brains
- **Animated Canvas** - Watch your zombies wander around the zoo
- **Auto-save** - Progress saves automatically every 5 seconds
- **Offline Progress** - Earn brains even when you're away (up to 8 hours)

## Tech Stack

- React 19
- TypeScript
- Vite
- Emotion (CSS-in-JS)
- HTML Canvas for animations
- LocalStorage for save data
- Vitest + React Testing Library (58 tests)
- Semantic Release (automated versioning)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## How to Play

1. Start with some brains
2. Open the Store and buy zombies
3. Zombies produce brains automatically over time
4. Buy more zombies to increase production
5. Unlock new zombie types as you earn more brains

## Roadmap

### Core Gameplay

- [x] Click mechanic - Click to manually collect brains
- [x] Upgrades system - Buy permanent production boosts
- [x] More zombie types - Add more tiers (bear, crocodile, frog, etc.)

### Progression & Retention

- [ ] Prestige/Rebirth - Reset for permanent multipliers
- [ ] Achievements - Unlock badges for milestones
- [ ] Milestones - Automatic bonuses at certain thresholds

### Polish & UX

- [ ] Show achievement when first visitor arrives
- [ ] Number formatting - Display large numbers (1.5K, 2.3M)
- [ ] Buy effects - Visual feedback when purchasing
- [ ] Sound effects - Audio for buying, achievements
- [ ] Settings modal - Volume controls, reset option
- [ ] Statistics page - Total brains earned, time played

### Advanced Features

- [ ] Offline progress popup - Show earnings while away
- [ ] Special events - Timed 2x production bonuses
- [ ] Unlockable themes - Different zoo backgrounds

## Credits

- Animal sprites from [Kenney's Animal Pack Redux](https://kenney.nl/assets/animal-pack-redux)

## License

MIT
