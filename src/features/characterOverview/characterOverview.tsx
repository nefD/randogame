import React from 'react';
import { useSelector } from 'react-redux';
import {
  getCharacterObject,
  getPlayerStats,
} from 'redux/character/character.selectors';
import './characterOverview.scss';
import {
  Box,
  Progress,
  Stack,
} from '@chakra-ui/core';
import { Card } from 'components/card';
import { Icon } from "components/icon/icon";
import { IconGold, IconHealth, IconHunger, IconMana } from "data/icons.consts";

export const CharacterOverview = () => {
  const character = useSelector(getCharacterObject);
  const stats = useSelector(getPlayerStats);

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

        <Stack direction="row" spacing={2} align="center">
          <Icon size='sm' icon={IconHealth} />
          <Box flex="1"><Progress colorScheme='red' hasStripe value={(stats.health / stats.healthMax) * 100} /></Box>
          <Icon size='sm' icon={IconMana} />
          <Box flex="1"><Progress colorScheme="blue" value={(stats.mana / stats.manaMax) * 100} /></Box>
          <Icon size='sm' icon={IconHunger} />
          <Box flex="1"><Progress colorScheme="yellow" value={(stats.hunger / stats.hungerMax) * 100} /></Box>
        </Stack>
      </Card>
    </Stack>
  );
};
