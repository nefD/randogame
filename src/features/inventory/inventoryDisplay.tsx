import React from 'react';
import 'features/inventory/inventoryDisplay.scss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { getPlayerInventory } from 'redux/character/character.selectors';
import {
  dropItemFromInventory,
  playerEquippedItem,
  playerUsedItem,
} from 'redux/character/character.slice';
import {
  Box,
  Button,
  Flex,
  Stack,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

} from '@chakra-ui/core';
import { EntityIcon } from 'features/common/entityIcon';
export const InventoryDisplay = () => {
  const dispatch = useDispatch();

  const items = useSelector(getPlayerInventory);

  return (
    <Stack spacing={1}>
      {items.map(item =>
        <Stack direction='row' spacing={2} className="inventoryItem" key={item.id} p={2}>
          <EntityIcon item={item} />
          <Stack flex='1' color='white' direction="row" spacing={2}>
            <Box>{item.name}</Box>
            {item.toolProps && (
              <Box>{`(Uses: ${item.toolProps.remainingUses}/${item.toolProps.maxUses})`}</Box>
            )}
          </Stack>

          {item.equipProps && (
            <Button size='sm' onClick={() => dispatch(playerEquippedItem(item))}>Equip</Button>
          )}

          {item.useProps && (
            <Button size='sm' onClick={() => dispatch(playerUsedItem(item))}>Use</Button>
          )}

          <Button size='sm' variantColor='red' onClick={() => dispatch(dropItemFromInventory(item))}>Drop</Button>
        </Stack>
      )}
    </Stack>
  );
};
