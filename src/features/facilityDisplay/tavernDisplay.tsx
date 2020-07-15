import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { playerUsedTavern } from 'redux/character/character.slice';

export const TavernDisplay = () => {
  const dispatch = useDispatch();

  return (
    <Stack direction="column" spacing={4} align="center">
      <Box>Welcome to the Tavern!</Box>
      <Button onClick={() => dispatch(playerUsedTavern())}>Eat a Meal</Button>
    </Stack>
  );
};
