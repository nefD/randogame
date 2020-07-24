import React, { FunctionComponent } from 'react';
import { Box, useStyleConfig } from '@chakra-ui/core';

const styleConfig = {
  baseStyle: (args: any) => ({
    container: {
      bg: args.colorMode === 'dark' ? 'gray.700' : 'gray.50',
      border: '1px',
      borderColor: args.colorMode === 'dark' ? 'gray.500' : 'gray.200',
      padding: 2,
    },
  }),

};

export const Card: FunctionComponent = (props) => {
  const styles = useStyleConfig('Box', { styleConfig });
  return <Box as={Box} sx={styles.container} {...props} />
}
