import { Item } from '../redux/items/items.slice';
import { uuid } from './random.utilities';
import {
  ITEM_KEYS,
  ItemDefinition,
} from 'data/item.consts';

export const isItemDefinition = (i: Partial<Item> | ItemDefinition): i is ItemDefinition => {
  return (i as ItemDefinition).config !== undefined;
};

export const ItemFactory = (config?: Partial<Item> | ItemDefinition): Item => {
  if (config && isItemDefinition(config)) {
    config = config.config;
  }

  return {
    id: uuid(),
    name: 'Unknown Item',
    goldValue: 1,
    key: ITEM_KEYS.Empty,
    ...config,
  };
}
