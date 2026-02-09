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
  upgradeMachine: vi.fn(),
  dismissAchievement: vi.fn()
};

describe("Header", () => {
  it("renders with help and settings buttons", () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();
    const onAchievementsClick = vi.fn();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header
          onHelpClick={onHelpClick}
          onSettingsClick={onSettingsClick}
          onAchievementsClick={onAchievementsClick}
        />
      </GameCtx.Provider>
    );

    // Check for buttons - the exact text depends on the implementation
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("calls onHelpClick when help button is clicked", async () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();
    const onAchievementsClick = vi.fn();
    const user = userEvent.setup();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header
          onHelpClick={onHelpClick}
          onSettingsClick={onSettingsClick}
          onAchievementsClick={onAchievementsClick}
        />
      </GameCtx.Provider>
    );

    const helpButton = screen.getByTitle("Help");
    await user.click(helpButton);
    expect(onHelpClick).toHaveBeenCalled();
  });

  it("calls onSettingsClick when settings button is clicked", async () => {
    const onHelpClick = vi.fn();
    const onSettingsClick = vi.fn();
    const onAchievementsClick = vi.fn();
    const user = userEvent.setup();

    render(
      <GameCtx.Provider value={mockGameContext}>
        <Header
          onHelpClick={onHelpClick}
          onSettingsClick={onSettingsClick}
          onAchievementsClick={onAchievementsClick}
        />
      </GameCtx.Provider>
    );

    const settingsButton = screen.getByTitle("Settings");
    await user.click(settingsButton);
    expect(onSettingsClick).toHaveBeenCalled();
  });
});
