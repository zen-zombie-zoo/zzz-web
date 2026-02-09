import React from "react";
import styled from "@emotion/styled";
import { theme } from "../theme";

const Intro = styled.p`
  margin-top: ${theme.spacingMd};
  line-height: ${theme.lineHeightRelaxed};
  color: ${theme.textMuted};
  font-size: ${theme.fontSizeSm};
`;

const Heading = styled.h3`
  margin-top: ${theme.spacingXl};
  padding-top: ${theme.spacingXl};
  border-top: 1px solid ${theme.borderSubtle};
`;

const List = styled.ul`
  margin: ${theme.spacingLg} 0 0 0;
  padding-left: ${theme.spacing2xl};
  line-height: ${theme.lineHeightRelaxed};
  color: ${theme.textMuted};
  font-size: ${theme.fontSizeSm};
  list-style-type: none;

  li {
    margin-bottom: ${theme.spacingSm};
  }

  li::marker {
    color: ${theme.colorAccent};
  }
`;

export const Tips: React.FC = () => {
  return (
    <div>
      <Intro>
        Grow your zombie collections to attract more zoo visitors and "earn"
        brains over time (in a totally legal way, of course). Use the brains to
        buy more zombies and unlock new types!
      </Intro>

      <Heading>Tips</Heading>
      <List>
        <li>
          Buy zombies to increase your brain production, and attract more
          visitors to your zoo
        </li>
        <li>Each zombie type produces different amounts of brains per second</li>
        <li>
          New zombie types unlock when you upgrade the Zombieficator Machine
        </li>
        <li>The game saves automatically every 5 seconds</li>
        <li>You earn offline progress when you return!</li>
        <li>Hint: visitors also give brains ;)</li>
      </List>
    </div>
  );
};
