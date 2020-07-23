import React from 'react';
import { Item } from 'redux/items/items.slice';
import * as icons from 'data/icons.consts';
import { EquipmentSlots } from 'redux/character/character.slice';

export enum ITEM_KEYS {
  Empty = 'Empty',
  TestItem = 'TestItem',
  Sand = 'Sand',
  Stick = 'Stick',
  Plant = 'Plant',
  WoodAxe = 'WoodAxe',
  Wood = 'Wood',
  Hat = 'Hat',
}

export type ItemKey = keyof typeof ITEM_KEYS;

export interface ItemDefinition {
  config: Partial<Item>;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
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
    icon: icons.IconSand,
    iconClass: 'sand',
    config: {
      key: ITEM_KEYS.Sand,
      name: 'Sand',
    },
  },
  [ITEM_KEYS.Stick]: {
    icon: icons.IconStick,
    iconClass: 'stick',
    config: {
      key: ITEM_KEYS.Stick,
      name: 'Stick',
    },
  },
  [ITEM_KEYS.Plant]: {
    icon: icons.IconPlant,
    iconClass: 'plant',
    config: {
      key: ITEM_KEYS.Plant,
      name: 'Plant',
    },
  },
  [ITEM_KEYS.WoodAxe]: {
    icon: icons.IconWoodAxe,
    iconClass: 'woodAxe',
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
    icon: icons.IconWood,
    iconClass: 'wood',
    config: {
      key: ITEM_KEYS.Wood,
      name: 'Wood',
    },
  },
  [ITEM_KEYS.Hat]: {
    config: {
      key: ITEM_KEYS.Hat,
      name: 'Hat',
      equipProps: {
        slotKey: EquipmentSlots.Head,
      },
    },
  },
};
