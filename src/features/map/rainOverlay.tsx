import React from 'react';
import './rain.scss';
import { Box } from '@chakra-ui/core';

export const RainOverlay = () => {
  let elements: JSX.Element[] = [];
  const targetCount = 15;
  for (let i = 0; i < targetCount; i++) {
    elements.push(
      <div key={i} className='rain' />
    );
  }

  return (
    <Box
      className='rainOverlay'
      zIndex={1}
      position="absolute" w="100%" h="100%"
    >
      <Box w='100%' h='100%' className='rainContainer'>
        {elements}
      </Box>
    </Box>
  );
};
