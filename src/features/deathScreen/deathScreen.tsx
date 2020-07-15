import React from 'react';
import {
  Box,
  Flex,
} from '@chakra-ui/core';
import './deathScreen.scss';

export const DeathScreen = () => {
  return (
    <Flex
      bg="panelBackground"
      borderWidth="1px"
      minW="500px"
      w="50vw"
      p={4}
      justify="center"
      align="center"
      direction="column"
    >
      <Box p={2} className="skullContainer"><div className="skull"><span role="img" aria-label="Game Over">💀</span></div></Box>
      <Box>You dead!</Box>
    </Flex>
  );
};
