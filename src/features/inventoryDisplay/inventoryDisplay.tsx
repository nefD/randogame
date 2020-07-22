import React from 'react';
import 'features/inventoryDisplay/inventoryDisplay.scss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { getPlayerInventory } from 'redux/character/character.selectors';
import { dropItemFromInventory } from 'redux/character/character.slice';
import {
  Box,
  Button,
  Flex,
  Stack,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

} from '@chakra-ui/core';
import { ItemIcon } from 'features/common/itemIcon/itemIcon';
export const InventoryDisplay = () => {
  const dispatch = useDispatch();

  const items = useSelector(getPlayerInventory);

  return (
    <Stack spacing={1}>
      {items.map(item =>
        <Flex className="inventoryItem" key={item.id} p={2}>
          <ItemIcon item={item} />
          <Stack flex='1' color='white' direction="row" spacing={2}>
            <Box>{item.name}</Box>
            {item.toolProps && (
              <Box>{`(Uses: ${item.toolProps.remainingUses}/${item.toolProps.maxUses})`}</Box>
            )}
          </Stack>

          <Button size='sm' onClick={() => dispatch(dropItemFromInventory(item))}>Drop</Button>
        </Flex>
      )}
    </Stack>
  );
};
