import React, { FunctionComponent } from 'react';
import { Box, useStyleConfig } from '@chakra-ui/core';



const styleConfig = {
  // register: {
  //   parts: ["container"],
  // },

  baseStyle: {
    container: {
      // bg: 'green.500',
      // fontWeight: "semibold",
      // borderRadius: "4px",
      // textTransform: "uppercase",
      // borderWidth: "1px",
      bg: 'gray.50',
      border: '1px',
      borderColor: 'gray.300',
      padding: 2,
    },
  },

};

export const Card: FunctionComponent = (props) => {
  const styles = useStyleConfig('Box', { styleConfig });


  return <Box as={Box} sx={styles.container} {...props} />
}
