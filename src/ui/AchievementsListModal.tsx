import React from "react";
import styled from "@emotion/styled";
import { theme } from "../theme";
import { ACHIEVEMENTS, type AchievementCategory, type AchievementDef } from "../game/achievements";

type Props = {
  unlockedIds: string[];
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  milestone: "Milestones",
  collection: "Collection",
  activity: "Activity"
};

const CATEGORY_ORDER: AchievementCategory[] = ["milestone", "collection", "activity"];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing3xl};
`;

const Counter = styled.div`
  text-align: center;
  font-size: ${theme.fontSizeMd};
  color: ${theme.textSecondary};

  span {
    color: ${theme.colorAccent};
    font-weight: ${theme.fontWeightBold};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacingLg};
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSizeMd};
  font-weight: ${theme.fontWeightSemibold};
  color: ${theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacingMd};
`;

const Card = styled.div<{ locked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacingLg};
  padding: ${theme.spacingLg};
  background: ${props => (props.locked ? theme.bgCard : theme.bgButton)};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${props => (props.locked ? theme.borderSubtle : theme.colorAccentDim)};
  opacity: ${props => (props.locked ? 0.5 : 1)};
  transition: all ${theme.transitionFast};
`;

const CardIcon = styled.div<{ locked: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => (props.locked ? theme.bgButtonHover : theme.colorAccentDim)};
  border-radius: ${theme.radiusSm};
  filter: ${props => (props.locked ? "grayscale(1)" : "none")};
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.div<{ locked: boolean }>`
  font-size: ${theme.fontSizeBase};
  font-weight: ${theme.fontWeightSemibold};
  color: ${props => (props.locked ? theme.textMuted : theme.textPrimary)};
  margin-bottom: 2px;
`;

const CardDescription = styled.div<{ locked: boolean }>`
  font-size: ${theme.fontSizeSm};
  color: ${props => (props.locked ? theme.textMuted : theme.textSecondary)};
`;

function AchievementCard({ achievement, unlocked }: { achievement: AchievementDef; unlocked: boolean }) {
  return (
    <Card locked={!unlocked}>
      <CardIcon locked={!unlocked}>{unlocked ? achievement.icon : "?"}</CardIcon>
      <CardContent>
        <CardName locked={!unlocked}>{unlocked ? achievement.name : "???"}</CardName>
        <CardDescription locked={!unlocked}>{unlocked ? achievement.description : "???"}</CardDescription>
      </CardContent>
    </Card>
  );
}

export const AchievementsListModal: React.FC<Props> = ({ unlockedIds }) => {
  const unlockedSet = new Set(unlockedIds);
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  const achievementsByCategory = CATEGORY_ORDER.map(category => ({
    category,
    label: CATEGORY_LABELS[category],
    achievements: ACHIEVEMENTS.filter(a => a.category === category)
  }));

  return (
    <Container>
      <Counter>
        <span>{unlockedCount}</span> / {totalCount} Achievements
      </Counter>

      {achievementsByCategory.map(({ category, label, achievements }) => (
        <Section key={category}>
          <SectionTitle>{label}</SectionTitle>
          <Grid>
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} unlocked={unlockedSet.has(achievement.id)} />
            ))}
          </Grid>
        </Section>
      ))}
    </Container>
  );
};
