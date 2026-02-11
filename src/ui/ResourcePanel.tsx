import React from "react";
import styled from "@emotion/styled";
import { useGame } from "../game/useGame";
import { theme } from "../theme";
import brain from "../assets/brain.svg";

const Container = styled.div``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacingLg};
  padding: ${theme.spacingMd} 0;

  &:first-of-type {
    padding-top: 0;
  }

  & + & {
    border-top: 1px solid ${theme.borderSubtle};
  }
`;

const Label = styled.div`
  color: ${theme.textMuted};
  font-size: ${theme.fontSizeSm};
  font-weight: ${theme.fontWeightMedium};
`;

interface ValueProps {
  variant?: "accent" | "money";
}

const Value = styled.div<ValueProps>`
  display: flex;
  align-items: center;
  gap: ${theme.spacingSm};
  font-weight: ${theme.fontWeightSemibold};
  color: ${props => {
    switch (props.variant) {
      case "accent":
        return theme.colorAccent;
      case "money":
        return theme.colorWarning;
      default:
        return theme.textPrimary;
    }
  }};

  img {
    opacity: 0.9;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingSm};
  font-size: ${theme.fontSizeXs};
  font-weight: ${theme.fontWeightMedium};
  padding: ${theme.spacingXs} ${theme.spacingMd};
  border-radius: ${theme.radiusSm};
  background: ${theme.bgCard};
  color: ${theme.textSecondary};
`;

export const ResourcePanel: React.FC = () => {
  const { state } = useGame();

  return (
    <Container>
      <Row>
        <Label>Brains</Label>
        <Value variant="accent">
          {Math.floor(state.brains).toLocaleString()}
          <img src={brain} alt="" width="14" height="14" />
        </Value>
      </Row>
      <Row>
        <Label>Production</Label>
        <Badge>
          +{state.brainsPerSecond.toFixed(1)}
          <img src={brain} alt="" width="12" height="12" />
          /s
        </Badge>
      </Row>
      <Row>
        <Label>Coins</Label>
        <Value variant="money">${Math.floor(state.money ?? 0).toLocaleString()}</Value>
      </Row>
      {state.visitorRate > 0 && (
        <Row>
          <Label>Visitors</Label>
          <Badge>{state.visitorRate.toFixed(1)}/s</Badge>
        </Row>
      )}
    </Container>
  );
};
