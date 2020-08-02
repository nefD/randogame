import React, {Fragment} from 'react';
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
  Button,
  Stack,
} from '@chakra-ui/core';
import { EntityIcon } from 'features/common/entityIcon/entityIcon';
import { EntityListItem } from "components/entityListItem/entityListItem";
import { Item } from "models/item";

export const InventoryDisplay = () => {
  const dispatch = useDispatch();
  const items = useSelector(getPlayerInventory);

  const getButtons = (item: Item) => (
    <Fragment>
      {item.equipProps && <Button key='equip' onClick={() => dispatch(playerEquippedItem(item))}>Equip</Button>}
      {item.useProps && <Button key='use' onClick={() => dispatch(playerUsedItem(item))}>Use</Button>}
      <Button key='drop' colorScheme='red' onClick={() => dispatch(dropItemFromInventory(item))}>Drop</Button>
    </Fragment>
  );

  const getLabel = (item: Item) => {
    let label = `${item.name} (Qty: ${item.quantity})`;
    if (item.toolProps) {
      label = `${label} (Uses: ${item.toolProps.remainingUses}/${item.toolProps.maxUses})`;
    }
    return label;
  }

  return (
    <Stack h='100%' maxH='100%' overflowY='auto' spacing={1}>
      {items.map(item =>
        <EntityListItem key={item.id} icon={<EntityIcon item={item}/>} label={getLabel(item)} buttons={getButtons(item)}/>
      )}
    </Stack>
  );
};
