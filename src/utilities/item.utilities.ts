import { ItemDefinition } from 'data/item.consts';
import { Item } from 'models/item';

export const isItemDefinition = (i: Partial<Item> | ItemDefinition): i is ItemDefinition => {
  return (i as ItemDefinition).config !== undefined;
};

