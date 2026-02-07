import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../Header";
import { GameCtx, type GameCtxType } from "../../game/context";
import { initialState } from "../../game/state";

const mockGameContext: GameCtxType = {
  state: initialState(),
  buyZombie: vi.fn(),
  nextCost: vi.fn(() => 10),
  collectBrain: vi.fn(),
  spawnVisitor: vi.fn(),
  upgradeMachine: vi.fn()
};

describe("Header", () => {
  it("renders with help and settings buttons", () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header onHelpClick={onHelpClick} onSettingsClick={onSettingsClick} />
      </GameCtx.Provider>
    );

    // Check for buttons - the exact text depends on the implementation
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("calls onHelpClick when help button is clicked", async () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();
    const user = userEvent.setup();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header onHelpClick={onHelpClick} onSettingsClick={onSettingsClick} />
      </GameCtx.Provider>
    );

    const buttons = screen.getAllByRole("button");
    // Find help button (typically first or has specific label)
    await user.click(buttons[0]);
    expect(onHelpClick).toHaveBeenCalled();
  });

  it("calls onSettingsClick when settings button is clicked", async () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();
    const user = userEvent.setup();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header onHelpClick={onHelpClick} onSettingsClick={onSettingsClick} />
      </GameCtx.Provider>
    );

    const buttons = screen.getAllByRole("button");
    // Settings button is typically the last or has specific label
    await user.click(buttons[buttons.length - 1]);
    expect(onSettingsClick).toHaveBeenCalled();
  });
});
