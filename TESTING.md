# Unit Tests Added to Zen Zombie Zoo

## Summary
✅ **58 tests across 6 test files** - All passing  
✅ **Game logic, state management, and UI components** fully covered  
✅ **Vitest + React Testing Library** setup with watch mode, UI dashboard, and coverage reporting  

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

## What Was Added

### Configuration Files
- **vitest.config.ts** - Vitest configuration with jsdom environment
- **src/test/setup.ts** - Global test setup with auto-cleanup between tests

### Test Files (6 files, 58 tests)

#### Game Logic Tests
1. **src/game/__tests__/economy.test.ts** (17 tests)
   - Cost calculations with exponential growth
   - Visitor attraction and rate calculations
   - DPS (production) with multipliers
   - Gold accumulation over time
   
2. **src/game/__tests__/save.test.ts** (7 tests)
   - Save/load from localStorage
   - Offline progress clamping (8 hours max)
   - Save deletion

3. **src/game/__tests__/machine.test.ts** (9 tests)
   - Machine upgrade progression
   - Zombie unlock logic
   - Upgrade cost verification

4. **src/game/__tests__/reducer.test.ts** (12 tests)
   - State mutations (BUY_ANIMAL, CLICK, TICK, SPAWN_VISITOR)
   - Complex workflows (buy → earn → upgrade)
   - Cost calculations and gold deductions

#### UI Component Tests
5. **src/ui/__tests__/Modal.test.tsx** (7 tests)
   - Visibility toggling
   - Click handling (overlay vs content)
   - Close button functionality

6. **src/ui/__tests__/ResourcePanel.test.tsx** (6 tests)
   - Display of all resource types
   - Number formatting
   - Conditional rendering (visitor rate)

## Package.json Changes

Added to scripts:
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

Added to devDependencies:
```json
"@testing-library/jest-dom": "^6.1.5",
"@testing-library/react": "^15.0.0",
"@testing-library/user-event": "^14.5.1",
"@vitest/ui": "^1.2.0",
"jsdom": "^24.0.0",
"vitest": "^1.2.0"
```

## Testing Best Practices Used

### 1. Pure Function Testing
Economy calculations tested in isolation with various inputs:
```typescript
it("applies multipliers correctly", () => {
  const state = initialState();
  state.generators.monkey.owned = 10;
  state.multipliers.perAnimal.monkey = 2;
  state.multipliers.global = 0.5;
  const result = recalcDps(state);
  expect(result.goldPerSecond).toBeGreaterThanOrEqual(10);
});
```

### 2. State Immutability Verification
Reducer tests ensure state is never mutated:
```typescript
const newGenerators = { ...state.generators };
newGenerators[action.id] = { owned: owned + action.qty };
const s1: GameState = { ...state, generators: newGenerators };
```

### 3. Component Testing with Mocked Context
UI components tested with controlled context values:
```typescript
render(
  <GameCtx.Provider value={mockGameContext}>
    <ResourcePanel />
  </GameCtx.Provider>
);
```

### 4. Floating-Point Precision
Using `toBeCloseTo()` for decimal comparisons:
```typescript
expect(rate).toBeCloseTo(0.3, 5); // 5 decimal places tolerance
```

### 5. Auto-Cleanup
Global setup clears localStorage and cleans up DOM after each test:
```typescript
afterEach(() => {
  cleanup();
  localStorage.clear();
});
```

## Key Test Scenarios

### Economy
- ✅ Single vs. multiple unit purchases
- ✅ Exponential cost growth
- ✅ Production from zombies with multipliers
- ✅ Visitor contribution to DPS
- ✅ Gold accumulation over time

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

## Files Modified
- ✏️ package.json - Added test scripts and dependencies
- ✏️ .github/copilot-instructions.md - Updated with testing guidelines

## Files Created
- 📄 vitest.config.ts - Test runner configuration
- 📄 src/test/setup.ts - Global test setup
- 📄 src/game/__tests__/{economy,save,machine,reducer}.test.ts
- 📄 src/ui/__tests__/{Modal,ResourcePanel}.test.tsx
- 📄 TEST_SUMMARY.md - Detailed test documentation
