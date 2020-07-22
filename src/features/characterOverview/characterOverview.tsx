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
          <Flex direction="row" align="center">
            <div className="icon"><img src="two-coins.svg" alt="Current Gold" /></div>
            <div>Gold: {character.gold}</div>
          </Flex>
          <Box>Atk: {character.stats.attack}</Box>
          <Box>Def: {character.stats.defense}</Box>
        </Stack>
      </Flex>

      <Stack direction="row" spacing={2} align="center">
        <div className="icon"><img src="hearts.svg" alt="Life"/></div>
        <Box flex="1"><Progress color="healthProgress" value={(character.stats.health / character.stats.healthMax) * 100} /></Box>
        <div className="icon"><img src="round-star.svg" alt="Mana"/></div>
        <Box flex="1"><Progress color="blue" value={(character.stats.mana / character.stats.manaMax) * 100} /></Box>
        <div className="icon"><img src="eating.svg" alt="Hunger"/></div>
        <Box flex="1"><Progress color="yellow" value={(character.stats.hunger / character.stats.hungerMax) * 100} /></Box>
      </Stack>
    </Stack>
  );
};
