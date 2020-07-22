import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { playerUsedTavern } from 'redux/character/character.slice';
import { getPlayerTavernCost } from 'redux/mapAreas/mapAreas.selectors';
import { getPlayerGold } from 'redux/character/character.selectors';

export const TavernDisplay = () => {
  const dispatch = useDispatch();

  const cost = useSelector(getPlayerTavernCost);
  const playerGold = useSelector(getPlayerGold);

  return (
    <Stack direction="column" spacing={4} align="center">
      <Box>Welcome to the Tavern!</Box>
      <Button isDisabled={playerGold < cost} onClick={() => dispatch(playerUsedTavern())}>
        Eat a Meal ({cost} Gold)
      </Button>
    </Stack>
  );
};
