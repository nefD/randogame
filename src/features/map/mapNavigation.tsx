import React from 'react';
import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import {
  playerMovingEast,
  playerMovingNorth,
  playerMovingSouth,
  playerMovingWest,
} from 'redux/character/character.slice';
import { useDispatch } from 'react-redux';
import { useKeyPress } from "utilities/hooks.utilities";

export const MapNavigation = () => {
  const dispatch = useDispatch();

  const upArrow = useKeyPress('ArrowUp');
  const downArrow = useKeyPress('ArrowDown');
  const leftArrow = useKeyPress('ArrowLeft');
  const rightArrow = useKeyPress('ArrowRight');

  if (upArrow) {
    dispatch(playerMovingNorth());
  } else if (downArrow) {
    dispatch(playerMovingSouth());
  } else if (leftArrow) {
    dispatch(playerMovingWest());
  } else if (rightArrow) {
    dispatch(playerMovingEast());
  }

  return (
    <Stack p={2} direction='row' justify='center' align='center'>
      <Box>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMovingWest())}>West</Button>
      </Box>
      <Stack direction='column'>
        <Button colorScheme='blue' variant="outline"size='lg' onClick={() => dispatch(playerMovingNorth())}>North</Button>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMovingSouth())}>South</Button>
      </Stack>
      <Box>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMovingEast())}>East</Button>
      </Box>
    </Stack>
  );
};
