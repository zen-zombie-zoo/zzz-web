import { Global, css } from "@emotion/react";
import { theme } from "./theme";

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
      }

      html,
      body,
      #root {
        height: 100%;
        overflow: hidden;
      }

      body {
        margin: 0;
        font-family: ${theme.fontFamily};
        font-size: ${theme.fontSizeBase};
        font-weight: ${theme.fontWeightNormal};
        line-height: ${theme.lineHeightNormal};
        background: ${theme.bg};
        color: ${theme.textPrimary};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Typography */
      h1 {
        font-size: ${theme.fontSizeXl};
        font-weight: ${theme.fontWeightBold};
        line-height: ${theme.lineHeightTight};
        margin: 0 0 ${theme.spacingLg};
        letter-spacing: -0.02em;
      }

      h2 {
        font-size: ${theme.fontSizeLg};
        font-weight: ${theme.fontWeightSemibold};
        line-height: ${theme.lineHeightTight};
        margin: 0 0 ${theme.spacingLg};
      }

      h3 {
        font-size: ${theme.fontSizeMd};
        font-weight: ${theme.fontWeightSemibold};
        line-height: ${theme.lineHeightTight};
        margin: 0 0 ${theme.spacingLg};
      }

      /* Buttons */
      button {
        background: ${theme.bgButton};
        color: ${theme.textPrimary};
        border: 1px solid ${theme.borderDefault};
        border-radius: ${theme.radiusMd};
        padding: ${theme.spacingMd} ${theme.spacingLg};
        font-family: inherit;
        font-size: ${theme.fontSizeBase};
        font-weight: ${theme.fontWeightMedium};
        cursor: pointer;
        transition: all ${theme.transitionFast};
        user-select: none;
      }

      button:hover:not(:disabled) {
        background: ${theme.bgButtonHover};
        border-color: ${theme.borderHover};
        transform: translateY(-1px);
      }

      button:active:not(:disabled) {
        background: ${theme.bgButtonActive};
        transform: translateY(0);
      }

      button:focus-visible {
        outline: 2px solid ${theme.colorPrimary};
        outline-offset: 2px;
      }

      button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    `}
  />
);
