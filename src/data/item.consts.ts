import React from 'react';
import * as icons from 'data/icons.consts';
import {EquipmentSlots} from 'models/character';
import {Item} from 'models/item';
import {STATS} from 'models/character/stats';
import {EffectType} from 'models/character/effects';
import {SKILL_KEY} from "data/skills.consts";

export enum ITEM_KEYS {
  Dagger = 'Dagger',
  Empty = 'Empty',
  Hat = 'Hat',
  HealingPotion = 'HealingPotion',
  Plant = 'Plant',
  Sand = 'Sand',
  Stick = 'Stick',
  TestItem = 'TestItem',
  Wood = 'Wood',
  WoodAxe = 'WoodAxe',
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
    icon: icons.IconPowder,
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
        bonuses: [
          { statKey: STATS.attack, modifier: 2 },
        ],
      },
    },
  },
  [ITEM_KEYS.HealingPotion]: {
    icon: icons.IconPotion,
    iconClass: 'healingPotion',
    config: {
      key: ITEM_KEYS.HealingPotion,
      name: 'Healing Potion',
      useProps: {
        effects: [
          {
            name: 'Healing Potion',
            type: EffectType.fixed,
            statModifiers: [{ statKey: STATS.health, amount: 10 }],
          },
        ],
      },
    },
  },
  [ITEM_KEYS.Dagger]: {
    icon: icons.IconDagger,
    iconClass: 'dagger',
    config: {
      key: ITEM_KEYS.Dagger,
      name: 'Dagger',
      equipProps: {
        slotKey: EquipmentSlots.Weapon,
        skillKey: SKILL_KEY.Daggers,
        damage: 3,
      },
    },
  },
};
