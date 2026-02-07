import React from "react";
import styled from "@emotion/styled";
import { useGame } from "../game/useGame";
import { theme } from "../theme";

type Props = {
  onHelpClick: () => void;
  onSettingsClick: () => void;
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacingXl};
  background: linear-gradient(
    180deg,
    rgba(20, 20, 25, 0.98) 0%,
    rgba(20, 20, 25, 0.95) 100%
  );
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${theme.borderSubtle};
  z-index: 100;
`;

const HeaderLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const HeaderCenter = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacingMd};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingMd};
`;

const LogoIcon = styled.span`
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(92, 255, 177, 0.4));
`;

const LogoText = styled.span`
  font-size: ${theme.fontSizeMd};
  font-weight: ${theme.fontWeightBold};
  background: linear-gradient(135deg, ${theme.colorAccent} 0%, #88ffcc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
`;

const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingLg};
  padding: ${theme.spacingMd} ${theme.spacingXl};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusLg};
  border: 1px solid ${theme.borderSubtle};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingSm};
`;

const StatIcon = styled.span`
  font-size: 16px;
`;

const StatValue = styled.span<{ variant?: "brains" | "coins" | "visitors" }>`
  font-size: ${theme.fontSizeMd};
  font-weight: ${theme.fontWeightBold};
  font-variant-numeric: tabular-nums;
  color: ${props =>
    props.variant === "brains"
      ? theme.colorAccent
      : props.variant === "coins"
        ? theme.colorWarning
        : props.variant === "visitors"
          ? theme.colorVisitor
          : theme.textPrimary};
`;

const StatRate = styled.span`
  font-size: ${theme.fontSizeXs};
  color: ${theme.textMuted};
  font-weight: ${theme.fontWeightMedium};
`;

const StatDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${theme.borderDefault};
`;

const HeaderButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.radiusMd};
  font-size: ${theme.fontSizeMd};
  background: ${theme.bgCard};
  border: 1px solid ${theme.borderSubtle};

  &:hover {
    background: ${theme.bgButtonHover};
    border-color: ${theme.borderHover};
  }
`;

export const Header: React.FC<Props> = ({ onHelpClick, onSettingsClick }) => {
  const { state } = useGame();

  return (
    <HeaderContainer>
      <HeaderLeft>
        <Logo>
          <LogoIcon>🧟</LogoIcon>
          <LogoText>Zen Zombie Zoo</LogoText>
        </Logo>
      </HeaderLeft>

      <HeaderCenter>
        <StatGroup>
          <Stat>
            <StatIcon>🧠</StatIcon>
            <StatValue variant="brains">
              {Math.floor(state.gold).toLocaleString()}
            </StatValue>
            <StatRate>+{state.goldPerSecond.toFixed(1)}/s</StatRate>
          </Stat>
          <StatDivider />
          <Stat>
            <StatIcon>💰</StatIcon>
            <StatValue variant="coins">
              ${Math.floor(state.money).toLocaleString()}
            </StatValue>
          </Stat>
          {state.visitorRate > 0 && (
            <>
              <StatDivider />
              <Stat>
                <StatIcon>👥</StatIcon>
                <StatValue variant="visitors">
                  {state.visitorRate.toFixed(1)}/s
                </StatValue>
              </Stat>
            </>
          )}
        </StatGroup>
      </HeaderCenter>

      <HeaderRight>
        <HeaderButton onClick={onHelpClick} title="Help">
          <span>?</span>
        </HeaderButton>
        <HeaderButton onClick={onSettingsClick} title="Settings">
          <span>⚙</span>
        </HeaderButton>
      </HeaderRight>
    </HeaderContainer>
  );
};
