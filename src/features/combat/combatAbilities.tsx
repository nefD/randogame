import React from 'react';
import { getPlayerCombatAbilities } from "redux/character/character.selectors";
import { useSelector } from "react-redux";
import { Divider, Box, SimpleGrid, Button } from '@chakra-ui/core';
import { AbilityDefs, AbilityKey } from "data/abilities.consts";

export type UseAbilityCallback = (abilityKey: AbilityKey) => any;

export type CombatAbilityProps = {
  onUseAbility: UseAbilityCallback,
};

const renderAbility = (abilityKey: AbilityKey, enabled: boolean, cb: UseAbilityCallback) => {
  const ability = AbilityDefs[abilityKey];
  return (
    <Button key={abilityKey} isDisabled={!enabled} onClick={() => cb(abilityKey)}>{ability.name}</Button>
  );
};

export function CombatAbilities(props: CombatAbilityProps) {

  const onUseAbility = props.onUseAbility ? props.onUseAbility : () => {};
  const abilities = useSelector(getPlayerCombatAbilities);

  return (
    <Box>
      <Divider/>
      <SimpleGrid columns={2} spacing={2}>
        {abilities.map(combatAbility => renderAbility(combatAbility.key, combatAbility.enabled, onUseAbility))}
      </SimpleGrid>
    </Box>
  );
}
