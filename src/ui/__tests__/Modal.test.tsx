import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal when open", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("displays title in header", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="My Test Title">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByText("My Test Title")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test">
        <div>Content</div>
      </Modal>
    );
    expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open={true} onClose={onClose} title="Test">
        <div>Content</div>
      </Modal>
    );
    const closeButton = screen.getByRole("button", { name: "✕" });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal open={true} onClose={onClose} title="Test">
        <div>Content</div>
      </Modal>
    );
    // Get the overlay (first styled div that's the Overlay component)
    const overlay = container.firstChild as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when clicking modal content", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open={true} onClose={onClose} title="Test">
        <div>Modal Content</div>
      </Modal>
    );
    const content = screen.getByText("Modal Content");
    await user.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });
});
