import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../theme";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.bgOverlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: ${fadeIn} ${theme.transitionNormal};
`;

const Content = styled.div`
  min-width: 360px;
  max-width: 640px;
  max-height: 85vh;
  overflow: auto;
  background: ${theme.bgPanel};
  border-radius: ${theme.radiusLg};
  padding: ${theme.spacingXl};
  border: 1px solid ${theme.borderSubtle};
  box-shadow: ${theme.shadowLg};
  animation: ${slideIn} ${theme.transitionSlow};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.bgButton};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.bgButtonHover};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacingXl};
  padding-bottom: ${theme.spacingLg};
  border-bottom: 1px solid ${theme.borderSubtle};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizeLg};
  font-weight: ${theme.fontWeightSemibold};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: ${theme.radiusSm};
  font-size: ${theme.fontSizeLg};
  cursor: pointer;
  color: ${theme.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitionFast};

  &:hover {
    background: ${theme.bgCard};
    color: ${theme.textPrimary};
    transform: none;
  }
`;

export const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>
        {children}
      </Content>
    </Overlay>
  );
};
