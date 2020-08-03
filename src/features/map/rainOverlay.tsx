import React from 'react';
import './rain.scss';
import { Box } from '@chakra-ui/core';

export const RainOverlay = () => {
  const rainArray = Array.from(Array(50));

  return (
    <Box
      bg='blackAlpha.300'
      zIndex={1}
      position="absolute" w="100%" h="100%"
    >
      <Box w='100%' h='100%' className='rainContainer'>
        {rainArray.map(i => <i key={i} className='rain' />)}
      </Box>
    </Box>
  );
};
