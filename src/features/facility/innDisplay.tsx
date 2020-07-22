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
import { playerUsedInn } from 'redux/character/character.slice';
import { getPlayerInnCost } from 'redux/mapAreas/mapAreas.selectors';
import { getPlayerGold } from 'redux/character/character.selectors';

export const InnDisplay = () => {
  const dispatch = useDispatch();

  const cost = useSelector(getPlayerInnCost);
  const playerGold = useSelector(getPlayerGold);

  return (
    <Stack direction="column" spacing={4} align="center">
      <Box>Welcome to the Inn!</Box>
      <Button isDisabled={playerGold < cost} onClick={() => dispatch(playerUsedInn())}>
        Rent a Room ({cost} Gold)
      </Button>
    </Stack>
  );
};
