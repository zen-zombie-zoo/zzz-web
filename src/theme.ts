// Theme constants for use in JavaScript/TypeScript (e.g., canvas drawing)
// These values mirror the CSS variables in theme.css

export const theme = {
  // Background colors
  bg: "#0f0f12",
  bgPanel: "#17171c",
  bgCard: "#1f2937",
  bgButton: "#23232b",

  // Text colors
  textPrimary: "#e7e7ef",
  textMuted: "#9ca3af",

  // Brand colors
  colorPrimary: "#6366f1",
  colorPrimaryLight: "#818cf8",
  colorAccent: "#6ee7b7",

  // Status colors
  colorSuccess: "#10b981",
  colorSuccessLight: "#34d399",
  colorWarning: "#fbbf24",
  colorDanger: "#ef4444",
  colorInactive: "#374151",

  // Game-specific colors
  colorVisitor: "#4ade80",
  colorVisitorFace: "#1a1a1a",
  colorFloatingText: "#f0a0d0",
  colorGear: "#e5e7eb"
} as const;
