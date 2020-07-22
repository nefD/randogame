import React from 'react';
import { useSelector } from 'react-redux';
import { getPlayerEquipment } from 'redux/character/character.selectors';
import { Box } from '@chakra-ui/core';
import { EquipmentSlots } from 'redux/character/character.slice';


export function Equipment() {
  const equipment = useSelector(getPlayerEquipment);

  return (
    <Box p={4} bg="panelBackground" borderWidth="1px" borderTop="none">
      {Object.values(EquipmentSlots).map(slotKey =>
        <Box>{slotKey}</Box>
      )}
    </Box>
  )
};
