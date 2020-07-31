import React from 'react';
import { getPlayerAbilities } from "redux/character/character.selectors";
import { useSelector } from "react-redux";
import { Box, Flex, Stack } from '@chakra-ui/core';
import { AbilityDefs, AbilityKey } from "data/abilities.consts";
import { EntityIcon } from "features/common/entityIcon/entityIcon";

const renderAbility = (abilityKey: AbilityKey) => {
  const ability = AbilityDefs[abilityKey];
  return (
    <Stack spacing={4} direction='row' align='center' key={ability.key}>
      <EntityIcon ability={ability}/>
      <Box flex='1'>{ability.name}</Box>
    </Stack>
  );
}

export function Abilities() {
  const playerAbilities = useSelector(getPlayerAbilities);

  return (
    <Box p={4}>
      {playerAbilities.map(ability => renderAbility(ability))}
    </Box>
  )
}
