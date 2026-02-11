import React from "react";
import styled from "@emotion/styled";
import { wipeSave } from "../game/save";
import { theme } from "../theme";

const Section = styled.div`
  margin-bottom: ${theme.spacing3xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizeSm};
  font-weight: ${theme.fontWeightSemibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.textMuted};
  margin: 0 0 ${theme.spacingLg} 0;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacingXl};
  padding: ${theme.spacingLg};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${theme.borderSubtle};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemLabel = styled.div`
  font-weight: ${theme.fontWeightMedium};
  margin-bottom: ${theme.spacingXs};
`;

const ItemDescription = styled.div`
  font-size: ${theme.fontSizeSm};
  color: ${theme.textMuted};
`;

const DangerButton = styled.button`
  background: ${theme.colorDangerDim};
  border-color: transparent;
  color: ${theme.colorDanger};
  padding: ${theme.spacingMd} ${theme.spacingXl};

  &:hover:not(:disabled) {
    background: ${theme.colorDanger};
    color: #fff;
    transform: none;
  }
`;

const About = styled.div`
  padding: ${theme.spacingLg};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${theme.borderSubtle};

  p {
    margin: 0 0 ${theme.spacingMd} 0;
    line-height: ${theme.lineHeightRelaxed};
    color: ${theme.textSecondary};
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const Version = styled.p`
  font-size: ${theme.fontSizeSm};
  color: ${theme.textMuted};
`;

export const SettingsModal: React.FC = () => {
  const handleClearSave = () => {
    if (window.confirm("Are you sure you want to clear all progress? This cannot be undone.")) {
      wipeSave();
      window.location.reload();
    }
  };

  return (
    <div>
      <Section>
        <SectionTitle>Game</SectionTitle>
        <Item>
          <ItemInfo>
            <ItemLabel>Clear Save Data</ItemLabel>
            <ItemDescription>Reset all progress and start fresh</ItemDescription>
          </ItemInfo>
          <DangerButton onClick={handleClearSave}>Clear Save</DangerButton>
        </Item>
      </Section>

      <Section>
        <SectionTitle>About</SectionTitle>
        <About>
          <p>
            <strong>Zen Zombie Zoo</strong> is an idle game where you collect zombie animals to attract visitors and earn brains.
          </p>
          <Version>Version 1.1.0</Version>
        </About>
      </Section>
    </div>
  );
};
