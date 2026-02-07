import { render, screen, waitFor } from "@testing-library/react";
import { GameProvider } from "../GameContext";
import { useGame } from "../useGame";

// Mock the save module
vi.mock("../save", () => ({
  load: vi.fn(() => null),
  save: vi.fn(),
  computeOfflineSeconds: vi.fn(() => 0)
}));

// Component that uses the game context for testing
const TestComponent = () => {
  const { state, collectBrain } = useGame();
  return (
    <div>
      <span>{Math.floor(state.gold)}</span>
      <button onClick={() => collectBrain()}>Click</button>
    </div>
  );
};

describe("GameProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides game context to children", () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it("allows clicking to increase gold", async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    const button = screen.getByText("Click");
    button.click();
    
    // After clicking, gold should increase from 100 to 101
    await waitFor(() => {
      expect(screen.getByText(/101/)).toBeInTheDocument();
    });
  });

  it("initializes with default state when no saved game", () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    // Should start with 100 gold
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });
});
