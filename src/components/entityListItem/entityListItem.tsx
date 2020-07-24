import React from 'react';
import {
  Stack, Box, useColorModeValue,
} from '@chakra-ui/core';

type EntityListItemProps = {
  icon?: JSX.Element;
  label: string;
  buttons?: JSX.Element;
};

export function EntityListItem(props: EntityListItemProps) {
  const { icon, label, buttons } = props;

  const bg = useColorModeValue("white", "gray.600");

  return (
    <Stack
      bg={bg}
      direction='row'
      spacing={2}
      align='center'
      justify='center'
      p={2}
    >
      {icon}
      <Box flex='1'>{label}</Box>
      {buttons}
    </Stack>
  );
}
