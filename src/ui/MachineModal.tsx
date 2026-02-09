import React from "react";
import styled from "@emotion/styled";
import { useGame } from "../game/useGame";
import {
  getNextUpgrade,
  MAX_MACHINE_LEVEL,
  isZombieUnlocked,
} from "../game/machine";
import { Zombies, type ZombieId } from "../game/zombies";
import { nextUnitCost, totalCostForQuantity } from "../game/economy";
import { theme } from "../theme";

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
  background: linear-gradient(
    135deg,
    ${theme.colorSuccess} 0%,
    ${theme.colorSuccessLight} 100%
  );
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

export const MachineModal: React.FC = () => {
  const { state, upgradeMachine, buyZombie } = useGame();
  const nextUpgrade = getNextUpgrade(state.machineLevel);
  const isMaxed = state.machineLevel >= MAX_MACHINE_LEVEL;

  return (
    <div>
      <Resources>
        <div>
          <strong>Brains:</strong> {Math.floor(state.brains).toLocaleString()}
        </div>
        <div>
          <strong>Coins:</strong> ${state.money.toLocaleString()}
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
                      <BuyButton
                        onClick={() => buyZombie(id, 1)}
                        disabled={state.brains < cost1}
                      >
                        +1 ({Math.floor(cost1).toLocaleString()})
                      </BuyButton>
                      <BuyButton
                        onClick={() => buyZombie(id, 10)}
                        disabled={state.brains < cost10}
                      >
                        +10
                      </BuyButton>
                    </ZombieButtons>
                  </Row>
                </ZombieItem>
              );
            })}
        </Column>

        <Column>
          <SectionTitle>
            Machine · Level {state.machineLevel}/{MAX_MACHINE_LEVEL}
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
                <UpgradeButton
                  onClick={upgradeMachine}
                  disabled={state.money < nextUpgrade.cost}
                >
                  Upgrade · ${nextUpgrade.cost}
                </UpgradeButton>
                {state.money < nextUpgrade.cost && (
                  <NeedMore>
                    Need ${(nextUpgrade.cost - state.money).toLocaleString()}{" "}
                    more coins
                  </NeedMore>
                )}
              </UpgradeCard>
            )
          )}
        </Column>
      </Columns>
    </div>
  );
};
