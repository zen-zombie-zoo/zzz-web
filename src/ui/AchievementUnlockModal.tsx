import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../theme";
import { getAchievementById } from "../game/achievements";

type Props = {
  achievementId: string;
  onDismiss: () => void;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(92, 255, 177, 0.3),
                0 0 40px rgba(92, 255, 177, 0.2),
                0 0 60px rgba(92, 255, 177, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(92, 255, 177, 0.5),
                0 0 60px rgba(92, 255, 177, 0.3),
                0 0 90px rgba(92, 255, 177, 0.2);
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
  z-index: 300;
  animation: ${fadeIn} ${theme.transitionNormal};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacingXl};
  padding: ${theme.spacing4xl};
  background: ${theme.bgPanel};
  border-radius: ${theme.radiusXl};
  border: 2px solid ${theme.colorAccent};
  animation: ${popIn} 0.4s ease-out, ${glow} 2s ease-in-out infinite;
  text-align: center;
  max-width: 360px;
`;

const UnlockedLabel = styled.div`
  font-size: ${theme.fontSizeXs};
  font-weight: ${theme.fontWeightBold};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: ${theme.colorAccent};
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: ${theme.colorAccentDim};
  border-radius: ${theme.radiusLg};
`;

const Name = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizeXl};
  font-weight: ${theme.fontWeightBold};
  color: ${theme.textPrimary};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${theme.fontSizeMd};
  color: ${theme.textSecondary};
  line-height: ${theme.lineHeightNormal};
`;

const DismissButton = styled.button`
  margin-top: ${theme.spacingMd};
  padding: ${theme.spacingMd} ${theme.spacing3xl};
  font-size: ${theme.fontSizeMd};
  font-weight: ${theme.fontWeightSemibold};
  color: ${theme.bg};
  background: ${theme.colorAccent};
  border: none;
  border-radius: ${theme.radiusMd};
  cursor: pointer;
  transition: all ${theme.transitionFast};

  &:hover {
    background: ${theme.colorSuccessLight};
    transform: translateY(-1px);
  }
`;

export const AchievementUnlockModal: React.FC<Props> = ({
  achievementId,
  onDismiss
}) => {
  const achievement = getAchievementById(achievementId);

  if (!achievement) return null;

  return (
    <Overlay onClick={onDismiss}>
      <Content onClick={e => e.stopPropagation()}>
        <UnlockedLabel>Achievement Unlocked!</UnlockedLabel>
        <IconContainer>{achievement.icon}</IconContainer>
        <Name>{achievement.name}</Name>
        <Description>{achievement.description}</Description>
        <DismissButton onClick={onDismiss}>Awesome!</DismissButton>
      </Content>
    </Overlay>
  );
};
