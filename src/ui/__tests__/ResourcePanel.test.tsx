import { render, screen } from "@testing-library/react";
import { ResourcePanel } from "../ResourcePanel";
import { GameCtx, type GameCtxType } from "../../game/context";
import { initialState } from "../../game/state";

const mockGameContext: GameCtxType = {
  state: { ...initialState(), gold: 1500, goldPerSecond: 5.5, money: 250, visitorRate: 0.3 },
  buyZombie: vi.fn(),
  nextCost: vi.fn(() => 10),
  collectBrain: vi.fn(),
  spawnVisitor: vi.fn(),
  upgradeMachine: vi.fn()
};

describe("ResourcePanel", () => {
  it("displays brains count", () => {
    render(
      <GameCtx.Provider value={mockGameContext}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  it("displays gold per second production", () => {
    render(
      <GameCtx.Provider value={mockGameContext}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    expect(screen.getByText(/\+5\.5/)).toBeInTheDocument();
  });

  it("displays coins (money)", () => {
    render(
      <GameCtx.Provider value={mockGameContext}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    expect(screen.getByText(/\$250/)).toBeInTheDocument();
  });

  it("displays visitor rate when greater than 0", () => {
    render(
      <GameCtx.Provider value={mockGameContext}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    expect(screen.getByText(/0\.3\/s/)).toBeInTheDocument();
  });

  it("does not display visitor rate when 0", () => {
    const stateWithNoVisitors = { ...mockGameContext, state: { ...mockGameContext.state, visitorRate: 0 } };
    render(
      <GameCtx.Provider value={stateWithNoVisitors}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    // The visitor row should not exist when visitorRate is 0
    const visitorLabels = screen.queryAllByText("Visitors");
    expect(visitorLabels).toHaveLength(0);
  });

  it("formats large numbers with locale string", () => {
    const largeContext = {
      ...mockGameContext,
      state: { ...mockGameContext.state, gold: 1000000 }
    };
    render(
      <GameCtx.Provider value={largeContext}>
        <ResourcePanel />
      </GameCtx.Provider>
    );
    // Should format as "1,000,000"
    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
  });
});
