import React from 'react';
import { useSelector } from 'react-redux';
import { getCharacterObject } from '../../redux/character/character.selectors';
import './characterOverview.scss';
import {
  Box,
  Flex,
  Progress,
  Stack,
} from '@chakra-ui/core';

interface CharacterOverviewProps {
  // character: CharacterState,
}

export const CharacterOverview = ({
  // character,
}: CharacterOverviewProps) => {
  const character = useSelector(getCharacterObject);

  return (
    <Stack direction="column" spacing={2}>
      <Flex bg="panelBackground" borderWidth="1px" p={1} direction="row" justifyContent="space-between" color="white">
        <Box>{character.name} - Level {character.level} {character.race} {character.class}</Box>
        <Stack direction="row">
          <Box>Gold: {character.gold}</Box>
          <Box>Atk: {character.stats.attack}</Box>
          <Box>Def: {character.stats.defense}</Box>
        </Stack>
      </Flex>

      <Stack direction="row" spacing={2}>
        <Box flex="1"><Progress color="healthProgress" value={(character.stats.health / character.stats.healthMax) * 100} /></Box>

        <Box flex="1"><Progress color="yellow" value={(character.stats.hunger / character.stats.hungerMax) * 100} /></Box>
      </Stack>
    </Stack>
  );
};
