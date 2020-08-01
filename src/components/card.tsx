import React, { FunctionComponent } from 'react';
import { Box, useStyleConfig } from '@chakra-ui/core';

type CardProps = {
  w?: string;
  h?: string;
};

const styleConfig = {
  baseStyle: (args: any) => ({
    bg: args.colorMode === 'dark' ? 'gray.700' : 'gray.50',
    border: '1px',
    borderColor: args.colorMode === 'dark' ? 'gray.500' : 'gray.300',
    padding: 2,
  }),

};

export const Card: FunctionComponent<CardProps> = (props) => {
  const styles = useStyleConfig('Box', { styleConfig });
  return <Box as={Box} sx={styles} {...props} />
}
