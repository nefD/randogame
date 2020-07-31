import React from 'react';
import { getPlayerAbilities } from "redux/character/character.selectors";
import { useSelector } from "react-redux";
import { Box, Flex } from '@chakra-ui/core';
import { AbilityDefs, AbilityKey } from "data/abilities.consts";

const renderAbility = (abilityKey: AbilityKey) => {
  const ability = AbilityDefs[abilityKey];
  return (
    <Flex key={ability.key}>
      <Box>{ability.name}</Box>
    </Flex>
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
