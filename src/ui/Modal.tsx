import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          minWidth: 320,
          maxWidth: 480,
          maxHeight: "80vh",
          overflow: "auto"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}
        >
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "var(--muted)"
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
