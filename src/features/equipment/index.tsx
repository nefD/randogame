import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { getPlayerEquipment } from 'redux/character/character.selectors';
import {
  Box,
  Button,
  Flex,
  Stack,
} from '@chakra-ui/core';
import {
  playerUnequippedItem,
} from 'redux/character/character.slice';
import {
  EquipmentSlots,
  EquipSlotKey,
} from 'models/character';


export function Equipment() {
  const dispatch = useDispatch();
  const equipment = useSelector(getPlayerEquipment);

  const renderSlot = (slotKey: EquipSlotKey) => {
    let itemContent;
    let buttonContent;
    const item = equipment[slotKey];
    if (item) {
      itemContent = <Box color='white'>{item.name}</Box>;
      buttonContent = <Button size='sm' onClick={() => dispatch(playerUnequippedItem(item))}>Remove</Button>;
    }
    return (
      <Stack spacing={2} direction='row' align='center' key={slotKey} bg='shopItemBackground' p={2}>
        <Box color='white' flex='1'>{slotKey}</Box>
        {itemContent}
        {buttonContent}
      </Stack>
    );
  };

  return (
    <Box p={4} bg="panelBackground" borderWidth="1px" borderTop="none">
      <Stack spacing={2}>
        {Object.values(EquipmentSlots).map(slotKey => renderSlot(slotKey))}
      </Stack>
    </Box>
  )
};
