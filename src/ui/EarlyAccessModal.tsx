import React from "react";
import styled from "@emotion/styled";
import { theme } from "../theme";

type Props = {
  onClose: () => void;
};

const Container = styled.div`
  text-align: center;
`;

const Description = styled.p`
  color: ${theme.textSecondary};
  line-height: ${theme.lineHeightRelaxed};
  margin: 0 0 ${theme.spacing3xl} 0;
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: ${theme.spacingLg} ${theme.spacingXl};
  background: ${theme.colorPrimary};
  border: 1px solid ${theme.colorPrimary};
  border-radius: ${theme.radiusMd};
  color: #fff;
  font-size: ${theme.fontSizeBase};
  font-weight: ${theme.fontWeightSemibold};
  cursor: pointer;
  transition: all ${theme.transitionFast};

  &:hover {
    background: ${theme.colorPrimaryHover};
    box-shadow: ${theme.shadowGlowPrimary};
    transform: none;
  }
`;

export const EarlyAccessModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Container>
      <Description>
        Welcome! This game is still a work in progress. Some features may be
        incomplete or change over time. Thanks for checking it out!
      </Description>

      <ContinueButton onClick={onClose}>Got it</ContinueButton>
    </Container>
  );
};
