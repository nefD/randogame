import React from 'react';
import { useSelector } from 'react-redux';
import {
  getCharacterObject,
  getPlayerStats,
} from 'redux/character/character.selectors';
import './characterOverview.scss';
import {
  Box,
  Flex,
  Progress,
  Stack,
} from '@chakra-ui/core';
import { Card } from 'components/card';

interface CharacterOverviewProps {
  // character: CharacterState,
}

export const CharacterOverview = ({
  // character,
}: CharacterOverviewProps) => {
  const character = useSelector(getCharacterObject);
  const stats = useSelector(getPlayerStats);

  console.log(`rendering.. stats`);

  return (
    <Stack direction="column" spacing={2}>
      <Card>
        <Stack spacing={2} p={1} direction="row" align='center' justify='center'>
          <Box flex='1'>{character.name} - Level {character.level} {character.race} {character.class}</Box>
          <Flex direction="row" align="center">
            <div className="icon"><img src="two-coins.svg" alt="Current Gold" /></div>
            <div>Gold: {character.gold}</div>
          </Flex>
          <Box>Atk: {stats.attack}</Box>
          <Box>Def: {stats.defense}</Box>
        </Stack>

        <Stack direction="row" spacing={2} align="center">
          <Box className="icon"><img src="hearts.svg" alt="Life"/></Box>
          <Box flex="1"><Progress colorScheme='red' hasStripe value={(stats.health / stats.healthMax) * 100} /></Box>
          <Box className="icon"><img src="round-star.svg" alt="Mana"/></Box>
          <Box flex="1"><Progress colorScheme="blue" value={(stats.mana / stats.manaMax) * 100} /></Box>
          <Box className="icon"><img src="eating.svg" alt="Hunger"/></Box>
          <Box flex="1"><Progress colorScheme="yellow" value={(stats.hunger / stats.hungerMax) * 100} /></Box>
        </Stack>
      </Card>
    </Stack>
  );
};
