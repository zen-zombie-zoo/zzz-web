// Theme constants for Emotion CSS-in-JS
export const theme = {
  // Background colors
  bg: "#0a0a0d",
  bgPanel: "#141419",
  bgCard: "#1a1a22",
  bgButton: "#252530",
  bgButtonHover: "#2f2f3d",
  bgButtonActive: "#3a3a4a",
  bgOverlay: "rgba(0, 0, 0, 0.75)",

  // Text colors
  textPrimary: "#f0f0f5",
  textSecondary: "#c5c5d0",
  textMuted: "#8888a0",

  // Brand colors
  colorPrimary: "#7c7cff",
  colorPrimaryHover: "#9494ff",
  colorPrimaryLight: "#a5a5ff",
  colorAccent: "#5cffb1",
  colorAccentDim: "rgba(92, 255, 177, 0.15)",

  // Status colors
  colorSuccess: "#22c992",
  colorSuccessLight: "#4aedb5",
  colorWarning: "#ffcc44",
  colorWarningDim: "rgba(255, 204, 68, 0.15)",
  colorDanger: "#ff5566",
  colorDangerDim: "rgba(255, 85, 102, 0.1)",
  colorInactive: "#3a3a4a",

  // Game-specific colors
  colorVisitor: "#5cff9f",
  colorVisitorFace: "#1a1a22",
  colorFloatingText: "#ff99cc",
  colorGear: "#e8e8f0",

  // Border colors
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(255, 255, 255, 0.15)",

  // Shadows
  shadowSm: "0 2px 4px rgba(0, 0, 0, 0.3)",
  shadowMd: "0 4px 12px rgba(0, 0, 0, 0.4)",
  shadowLg: "0 8px 24px rgba(0, 0, 0, 0.5)",
  shadowGlowPrimary: "0 0 20px rgba(124, 124, 255, 0.3)",
  shadowGlowAccent: "0 0 20px rgba(92, 255, 177, 0.2)",
  shadowGlowSuccess: "0 0 20px rgba(34, 201, 146, 0.3)",

  // Typography
  fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", Arial, sans-serif',
  fontSizeXs: "11px",
  fontSizeSm: "13px",
  fontSizeBase: "14px",
  fontSizeMd: "16px",
  fontSizeLg: "20px",
  fontSizeXl: "28px",
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.7,

  // Spacing
  spacingXs: "4px",
  spacingSm: "6px",
  spacingMd: "8px",
  spacingLg: "12px",
  spacingXl: "16px",
  spacing2xl: "20px",
  spacing3xl: "24px",
  spacing4xl: "32px",

  // Border radius
  radiusSm: "6px",
  radiusMd: "8px",
  radiusLg: "12px",
  radiusXl: "16px",

  // Transitions
  transitionFast: "150ms ease",
  transitionNormal: "200ms ease",
  transitionSlow: "300ms ease"
} as const;

export type Theme = typeof theme;
