## Quick Start

```bash
# Install dependencies (includes testing libraries)
npm install --legacy-peer-deps

# Run tests in watch mode
npm test

# Open interactive test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Configuration Files
- **vitest.config.ts** - Vitest configuration with jsdom environment
- **src/test/setup.ts** - Global test setup with auto-cleanup between tests

## Key Test Scenarios

### Economy
- ✅ Single vs. multiple unit purchases
- ✅ Exponential cost growth
- ✅ Production from zombies with multipliers
- ✅ Visitor contribution to DPS
- ✅ Brains accumulation over time

### Save/Load
- ✅ Persistence to localStorage
- ✅ Offline progress calculation
- ✅ 8-hour clamping for sanity
- ✅ Save deletion

### Upgrades
- ✅ Machine progression
- ✅ Zombie unlocking via levels
- ✅ Increasing upgrade costs

### UI
- ✅ Modal visibility and interactions
- ✅ Resource panel displays
- ✅ Number formatting
- ✅ Conditional visibility

## Troubleshooting

### Tests won't run
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
npm test -- --run
```

### Watch mode issues
```bash
# Run in single-pass mode for CI
npm test -- --run

# Or with coverage
npm run test:coverage
```

## Next Steps for Expansion

1. **Canvas component tests** - Mock canvas rendering for ZooCanvas
2. **GameProvider integration** - Test full component lifecycle with context
3. **E2E scenarios** - Test complete game flows from start to progression milestones
4. **Performance tests** - Verify calculations with large zombie counts
5. **Snapshot tests** - For component structure stability
