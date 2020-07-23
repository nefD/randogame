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
  EquipmentSlots,
  EquipSlotKey,
  playerUnequippedItem,
} from 'redux/character/character.slice';


export function Equipment() {
  const dispatch = useDispatch();
  const equipment = useSelector(getPlayerEquipment);

  const renderSlot = (slotKey: EquipSlotKey) => {
    const content: JSX.Element[] = [
      <Box color='white' flex='1'>{slotKey}</Box>
    ];
    const item = equipment[slotKey];
    if (item) {
      content.push(
        <Box color='white'>{item.name}</Box>,
        <Button size='sm' onClick={() => dispatch(playerUnequippedItem(item))}>Remove</Button>,
      );
    } else {
      content.push(<Box>None</Box>)
    }
    return (
      <Stack spacing={2} direction='row' align='center' key={slotKey}  bg='shopItemBackground' p={2}>
        {content}
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
