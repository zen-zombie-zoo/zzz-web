import { renderHook } from "@testing-library/react";
import { useGame } from "../useGame";

describe("useGame", () => {
  it("throws error when used outside GameProvider", () => {
    expect(() => {
      renderHook(() => useGame());
    }).toThrow("useGame must be used within GameProvider");
  });
});
