import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { playerUsedInn } from 'redux/character/character.slice';

export const InnDisplay = () => {
  const dispatch = useDispatch();

  return (
    <Stack direction="column" spacing={4} align="center">
      <Box>Welcome to the Inn!</Box>
      <Button onClick={() => dispatch(playerUsedInn())}>Rent a Room</Button>
    </Stack>
  );
};
