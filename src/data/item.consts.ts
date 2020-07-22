import { Item } from 'redux/items/items.slice';

export enum ITEM_KEYS {
  Empty = 'Empty',
  TestItem = 'TestItem',
  Sand = 'Sand',
  Stick = 'Stick',
  Plant = 'Plant',
  WoodAxe = 'WoodAxe',
  Wood = 'Wood',
}

export type ItemKey = keyof typeof ITEM_KEYS;

export interface ItemDefinition {
  config: Partial<Item>;
  iconPath?: string;
}

export const ItemDefs: { [key in ITEM_KEYS]: ItemDefinition } = {
  [ITEM_KEYS.Empty]: {
    config: {
      key: ITEM_KEYS.Empty,
      name: 'Empty Item',
    },
  },
  [ITEM_KEYS.TestItem]: {
    config: {
      key: ITEM_KEYS.TestItem,
      name: 'Test Item',
    },
  },
  [ITEM_KEYS.Sand]: {
    iconPath: 'sand.svg',
    config: {
      key: ITEM_KEYS.Sand,
      name: 'Sand',
    },
  },
  [ITEM_KEYS.Stick]: {
    iconPath: 'wood-stick.svg',
    config: {
      key: ITEM_KEYS.Stick,
      name: 'Stick',
    },
  },
  [ITEM_KEYS.Plant]: {
    iconPath: 'zigzag-leaf.svg',
    config: {
      key: ITEM_KEYS.Plant,
      name: 'Plant',
    },
  },
  [ITEM_KEYS.WoodAxe]: {
    iconPath: 'axe-in-log.svg',
    config: {
      key: ITEM_KEYS.WoodAxe,
      name: 'Wood Axe',
      toolProps: {
        remainingUses: 6,
        maxUses: 6,
      },
    },
  },
  [ITEM_KEYS.Wood]: {
    iconPath: 'log.svg',
    config: {
      key: ITEM_KEYS.Wood,
      name: 'Wood',
    },
  },
};
