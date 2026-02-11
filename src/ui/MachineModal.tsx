import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useGame } from "../game/useGame";
import { getNextUpgrade, MAX_MACHINE_LEVEL, isZombieUnlocked } from "../game/machine";
import { Zombies, type ZombieId } from "../game/zombies";
import { nextUnitCost, totalCostForQuantity } from "../game/economy";
import { theme } from "../theme";
import { BOOSTS, isBoostActive, getRemainingTime } from "../game/boosts";
import { SYNERGIES, getActiveSynergies } from "../game/synergy";

const Resources = styled.div`
  display: flex;
  gap: ${theme.spacing4xl};
  margin-bottom: ${theme.spacing3xl};
  padding: ${theme.spacingLg} ${theme.spacingXl};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${theme.borderSubtle};

  > div {
    display: flex;
    align-items: center;
    gap: ${theme.spacingMd};
  }

  strong {
    color: ${theme.textMuted};
    font-weight: ${theme.fontWeightMedium};
  }
`;

const Columns = styled.div`
  display: flex;
  gap: ${theme.spacing3xl};
`;

const Column = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${theme.spacingLg} 0;
  font-size: ${theme.fontSizeSm};
  font-weight: ${theme.fontWeightSemibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.textMuted};
`;

const ZombieItem = styled.div`
  margin-bottom: ${theme.spacingMd};
  padding: ${theme.spacingLg};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${theme.borderSubtle};
  transition: all ${theme.transitionFast};

  &:hover {
    border-color: ${theme.borderHover};
    background: ${theme.bgButton};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacingMd};
`;

const ZombieName = styled.div`
  font-weight: ${theme.fontWeightSemibold};
  margin-bottom: ${theme.spacingXs};
`;

const ZombieMeta = styled.div`
  color: ${theme.textMuted};
  font-size: ${theme.fontSizeXs};
`;

const ZombieButtons = styled.div`
  display: flex;
  gap: ${theme.spacingSm};
`;

const BuyButton = styled.button`
  padding: ${theme.spacingSm} ${theme.spacingLg};
  font-size: ${theme.fontSizeSm};
  white-space: nowrap;
`;

const UpgradeCard = styled.div`
  padding: ${theme.spacingXl};
  background: ${theme.bgCard};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${theme.borderSubtle};
`;

const UpgradeCardMaxed = styled.div`
  padding: ${theme.spacingXl};
  background: linear-gradient(135deg, ${theme.colorSuccess} 0%, ${theme.colorSuccessLight} 100%);
  border-radius: ${theme.radiusMd};
  text-align: center;
  box-shadow: ${theme.shadowGlowSuccess};

  strong {
    font-size: ${theme.fontSizeMd};
  }
`;

const MaxedSubtitle = styled.div`
  margin-top: ${theme.spacingSm};
  font-size: ${theme.fontSizeSm};
  opacity: 0.9;
`;

const NextTitle = styled.div`
  margin-bottom: ${theme.spacingMd};
  font-size: ${theme.fontSizeMd};
`;

const Unlocks = styled.div`
  margin-bottom: ${theme.spacingXl};
  padding: ${theme.spacingMd} ${theme.spacingLg};
  background: ${theme.colorAccentDim};
  border-radius: ${theme.radiusSm};
  color: ${theme.colorAccent};
  font-size: ${theme.fontSizeSm};
  font-weight: ${theme.fontWeightMedium};
`;

const UpgradeButton = styled.button`
  width: 100%;
  padding: ${theme.spacingLg} ${theme.spacingXl};
  font-size: ${theme.fontSizeMd};
  font-weight: ${theme.fontWeightSemibold};
  background: ${theme.colorPrimary};
  border-color: ${theme.colorPrimary};
  color: #fff;

  &:hover:not(:disabled) {
    background: ${theme.colorPrimaryHover};
    border-color: ${theme.colorPrimaryHover};
    box-shadow: ${theme.shadowGlowPrimary};
  }
`;

const NeedMore = styled.div`
  margin-top: ${theme.spacingLg};
  padding: ${theme.spacingMd};
  background: ${theme.colorDangerDim};
  border-radius: ${theme.radiusSm};
  color: ${theme.colorDanger};
  font-size: ${theme.fontSizeSm};
  text-align: center;
`;

const BoostItem = styled.div<{ active?: boolean }>`
  margin-bottom: ${theme.spacingMd};
  padding: ${theme.spacingLg};
  background: ${props => (props.active ? theme.colorWarningDim : theme.bgCard)};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${props => (props.active ? theme.colorWarning : theme.borderSubtle)};
  transition: all ${theme.transitionFast};
`;

const BoostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingMd};
  margin-bottom: ${theme.spacingSm};
`;

const BoostIcon = styled.span`
  font-size: 20px;
`;

const BoostName = styled.div`
  font-weight: ${theme.fontWeightSemibold};
`;

const BoostDesc = styled.div`
  color: ${theme.textMuted};
  font-size: ${theme.fontSizeXs};
  margin-bottom: ${theme.spacingMd};
`;

const BoostButton = styled.button<{ active?: boolean }>`
  width: 100%;
  padding: ${theme.spacingSm} ${theme.spacingLg};
  font-size: ${theme.fontSizeSm};
  background: ${props => (props.active ? theme.colorWarning : theme.bgButton)};
  color: ${props => (props.active ? theme.bgCard : theme.textPrimary)};

  &:disabled {
    opacity: 0.5;
  }
`;

const SynergyItem = styled.div<{ active?: boolean }>`
  margin-bottom: ${theme.spacingMd};
  padding: ${theme.spacingMd};
  background: ${props => (props.active ? theme.colorAccentDim : theme.bgCard)};
  border-radius: ${theme.radiusMd};
  border: 1px solid ${props => (props.active ? theme.colorAccent : theme.borderSubtle)};
  opacity: ${props => (props.active ? 1 : 0.5)};
`;

const SynergyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacingSm};
  font-weight: ${theme.fontWeightSemibold};
  font-size: ${theme.fontSizeSm};
`;

const SynergyBonus = styled.div`
  color: ${theme.colorAccent};
  font-size: ${theme.fontSizeXs};
  margin-top: ${theme.spacingXs};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacingSm};
  margin-bottom: ${theme.spacingLg};
`;

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: ${theme.spacingMd};
  font-size: ${theme.fontSizeSm};
  background: ${props => (props.active ? theme.colorPrimary : theme.bgCard)};
  border: 1px solid ${props => (props.active ? theme.colorPrimary : theme.borderSubtle)};
  color: ${props => (props.active ? "#fff" : theme.textSecondary)};
  border-radius: ${theme.radiusMd};

  &:hover {
    background: ${props => (props.active ? theme.colorPrimaryHover : theme.bgButton)};
  }
`;

export const MachineModal: React.FC = () => {
  const { state, upgradeMachine, buyZombie, activateBoost } = useGame();
  const nextUpgrade = getNextUpgrade(state.machineLevel);
  const isMaxed = state.machineLevel >= MAX_MACHINE_LEVEL;
  const [rightTab, setRightTab] = useState<"machine" | "boosts" | "synergies">("machine");
  const [, setTick] = useState(0);

  // Update every second for boost timers
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const activeSynergies = getActiveSynergies(state);

  return (
    <div>
      <Resources>
        <div>
          <strong>Brains:</strong> {Math.floor(state.brains).toLocaleString()}
        </div>
        <div>
          <strong>Coins:</strong> ${Math.floor(state.money).toLocaleString()}
        </div>
      </Resources>

      <Columns>
        <Column>
          <SectionTitle>Buy Zombies</SectionTitle>
          {(Object.keys(Zombies) as ZombieId[])
            .filter(id => isZombieUnlocked(id, state.machineLevel))
            .map(id => {
              const def = Zombies[id];
              const owned = state.generators[id]?.owned ?? 0;
              const cost1 = nextUnitCost(def, owned);
              const cost10 = totalCostForQuantity(def, owned, 10);

              return (
                <ZombieItem key={id}>
                  <Row>
                    <div>
                      <ZombieName>{def.name}</ZombieName>
                      <ZombieMeta>
                        +{def.baseProd}/s · Owned: {owned}
                      </ZombieMeta>
                    </div>
                    <ZombieButtons>
                      <BuyButton onClick={() => buyZombie(id, 1)} disabled={state.brains < cost1}>
                        +1 ({Math.floor(cost1).toLocaleString()})
                      </BuyButton>
                      <BuyButton onClick={() => buyZombie(id, 10)} disabled={state.brains < cost10}>
                        +10
                      </BuyButton>
                    </ZombieButtons>
                  </Row>
                </ZombieItem>
              );
            })}
        </Column>

        <Column>
          <TabContainer>
            <Tab active={rightTab === "machine"} onClick={() => setRightTab("machine")}>
              Machine
            </Tab>
            <Tab active={rightTab === "boosts"} onClick={() => setRightTab("boosts")}>
              Boosts
            </Tab>
            <Tab active={rightTab === "synergies"} onClick={() => setRightTab("synergies")}>
              Synergies {activeSynergies.length > 0 && `(${activeSynergies.length})`}
            </Tab>
          </TabContainer>

          {rightTab === "machine" && (
            <>
              <SectionTitle>
                Level {state.machineLevel}/{MAX_MACHINE_LEVEL}
              </SectionTitle>

              {isMaxed ? (
                <UpgradeCardMaxed>
                  <strong>Fully Upgraded!</strong>
                  <MaxedSubtitle>All species unlocked</MaxedSubtitle>
                </UpgradeCardMaxed>
              ) : (
                nextUpgrade && (
                  <UpgradeCard>
                    <NextTitle>
                      <strong>{nextUpgrade.name}</strong>
                    </NextTitle>
                    <Unlocks>Unlocks {Zombies[nextUpgrade.unlocks].name}</Unlocks>
                    <UpgradeButton onClick={upgradeMachine} disabled={state.money < nextUpgrade.cost}>
                      Upgrade · ${nextUpgrade.cost.toLocaleString()}
                    </UpgradeButton>
                    {state.money < nextUpgrade.cost && <NeedMore>Need ${(nextUpgrade.cost - state.money).toLocaleString()} more coins</NeedMore>}
                  </UpgradeCard>
                )
              )}
            </>
          )}

          {rightTab === "boosts" && (
            <>
              <SectionTitle>Temporary Boosts</SectionTitle>
              {BOOSTS.map(boost => {
                const active = isBoostActive(state.activeBoosts ?? [], boost.id);
                const remaining = getRemainingTime(state.activeBoosts ?? [], boost.id);

                return (
                  <BoostItem key={boost.id} active={active}>
                    <BoostHeader>
                      <BoostIcon>{boost.icon}</BoostIcon>
                      <BoostName>{boost.name}</BoostName>
                    </BoostHeader>
                    <BoostDesc>{boost.description}</BoostDesc>
                    <BoostButton active={active} onClick={() => activateBoost(boost.id)} disabled={active || state.money < boost.cost}>
                      {active ? `Active (${remaining}s)` : `Activate · $${boost.cost}`}
                    </BoostButton>
                  </BoostItem>
                );
              })}
            </>
          )}

          {rightTab === "synergies" && (
            <>
              <SectionTitle>Zoo Synergies</SectionTitle>
              {SYNERGIES.map(synergy => {
                const active = activeSynergies.some(s => s.id === synergy.id);
                const bonusText =
                  synergy.bonus.type === "production"
                    ? `+${Math.round((synergy.bonus.multiplier - 1) * 100)}% brain production`
                    : synergy.bonus.type === "visitors"
                      ? `+${Math.round((synergy.bonus.multiplier - 1) * 100)}% visitor rate`
                      : `+${Math.round((synergy.bonus.multiplier - 1) * 100)}% to everything`;

                return (
                  <SynergyItem key={synergy.id} active={active}>
                    <SynergyHeader>
                      <span>{synergy.icon}</span>
                      <span>{synergy.name}</span>
                      {active && <span>✓</span>}
                    </SynergyHeader>
                    <BoostDesc>{synergy.description}</BoostDesc>
                    <SynergyBonus>{active ? bonusText : `Requires: ${synergy.requires.map(r => `${r.count}x ${Zombies[r.id].name}`).join(", ")}`}</SynergyBonus>
                  </SynergyItem>
                );
              })}
            </>
          )}
        </Column>
      </Columns>
    </div>
  );
};
