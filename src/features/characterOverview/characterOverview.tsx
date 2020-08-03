import React from 'react';
import { useSelector } from 'react-redux';
import {
  getCharacterObject, getGameDate,
  getPlayerStats,
} from 'redux/character/character.selectors';
import './characterOverview.scss';
import {
  Box,
  Progress,
  Stack,
  Flex,
} from '@chakra-ui/core';
import { Card } from 'components/card';
import { Icon } from "components/icon/icon";
import { IconGold, IconHealth, IconHunger, IconMana } from "data/icons.consts";

export const CharacterOverview = () => {
  const character = useSelector(getCharacterObject);
  const stats = useSelector(getPlayerStats);
  const gameDate = useSelector(getGameDate);

  function getOrdinalNum(n: number) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  return (
    <Stack direction="column" spacing={2}>
      <Card>
        <Stack spacing={2} p={1} direction="row" align='center' justify='center'>
          <Box flex='1'>{character.name} - Level {character.level} {character.race} {character.class}</Box>
          <Icon size='sm' icon={IconGold} />
          <Box>Gold: {character.gold}</Box>
          <Box>Atk: {stats.attack}</Box>
          <Box>Def: {stats.defense}</Box>
        </Stack>
        <Flex>
          <Box>
            {gameDate.dayOfTheWeek} the {getOrdinalNum(gameDate.dayOfSeason)}, Week {gameDate.week}, {gameDate.season}
          </Box>
        </Flex>

        <Stack direction="row" spacing={2} align="center">
          <Icon size='sm' icon={IconHealth} />
          <Flex flex="1" direction='column'>
            <Box fontSize='sm'>Health: {stats.health} / {stats.healthMax}</Box>
            <Progress colorScheme='red' size='sm' hasStripe value={(stats.health / stats.healthMax) * 100} />
          </Flex>
          <Icon size='sm' icon={IconMana} />
          <Flex flex="1" direction='column'>
            <Box fontSize='sm'>Mana: {stats.mana} / {stats.manaMax}</Box>
            <Progress colorScheme="blue" size='sm' value={(stats.mana / stats.manaMax) * 100} />
          </Flex>
          <Icon size='sm' icon={IconHunger} />
          <Flex flex="1" direction='column'>
            <Box fontSize='sm'>Hunger: {stats.hunger} / {stats.hungerMax}</Box>
            <Progress colorScheme="yellow" size='sm' value={(stats.hunger / stats.hungerMax) * 100} />
          </Flex>
        </Stack>
      </Card>
    </Stack>
  );
};
