import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import { playerMoving } from 'redux/character/character.slice';
import { useDispatch } from 'react-redux';
import { useKeyPress } from "utilities/hooks.utilities";
import { DIRECTION } from "data/commonTypes";

export function MapNavigation() {
  const dispatch = useDispatch();

  const upArrow = useKeyPress('ArrowUp');
  const downArrow = useKeyPress('ArrowDown');
  const leftArrow = useKeyPress('ArrowLeft');
  const rightArrow = useKeyPress('ArrowRight');

  useEffect(() => {
    upArrow && dispatch(playerMoving(DIRECTION.north));
    downArrow && dispatch(playerMoving(DIRECTION.south));
    leftArrow && dispatch(playerMoving(DIRECTION.west));
    rightArrow && dispatch(playerMoving(DIRECTION.east));
  });

  return (
    <Stack p={2} direction='row' justify='center' align='center'>
      <Box>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMoving(DIRECTION.west))}>West</Button>
      </Box>
      <Stack direction='column'>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMoving(DIRECTION.north))}>North</Button>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMoving(DIRECTION.south))}>South</Button>
      </Stack>
      <Box>
        <Button colorScheme='blue' variant="outline" size='lg' onClick={() => dispatch(playerMoving(DIRECTION.east))}>East</Button>
      </Box>
    </Stack>
  );
}
