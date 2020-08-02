import React from 'react';
import * as icons from 'data/icons.consts';
import { EquipmentSlots } from 'models/character';
import { Item } from 'models/item';
import { STATS } from 'models/character/stats';
import { EffectType } from 'models/character/effects';
import { SKILL_KEY } from "data/skills.consts";
import { ABILITY_KEY } from "data/abilities.consts";
import { RECIPE_KEYS } from "data/recipes.consts";
import { ITEM_KEYS } from "data/item.keys";

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
      stackable: false,
    },
  },
  [ITEM_KEYS.Sand]: {
    icon: icons.IconPowder,
    iconClass: 'sand',
    config: {
      key: ITEM_KEYS.Sand,
      name: 'Sand',
      stackable: true,
    },
  },
  [ITEM_KEYS.Stick]: {
    icon: icons.IconStick,
    iconClass: 'stick',
    config: {
      key: ITEM_KEYS.Stick,
      name: 'Stick',
      stackable: true,
    },
  },
  [ITEM_KEYS.Plant]: {
    icon: icons.IconPlant,
    iconClass: 'plant',
    config: {
      key: ITEM_KEYS.Plant,
      name: 'Plant',
      stackable: true,
    },
  },
  [ITEM_KEYS.WoodAxe]: {
    icon: icons.IconWoodAxe,
    iconClass: 'woodAxe',
    config: {
      key: ITEM_KEYS.WoodAxe,
      name: 'Wood Axe',
      stackable: false,
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
      stackable: true,
    },
  },
  [ITEM_KEYS.Hat]: {
    config: {
      key: ITEM_KEYS.Hat,
      name: 'Hat',
      stackable: false,
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
      stackable: true,
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
  [ITEM_KEYS.TomeTesting]: {
    config: {
      key: ITEM_KEYS.TomeTesting,
      name: 'Tome of Testing',
      stackable: false,
      useProps: {
        giveAbilities: [ABILITY_KEY.Puncture],
        giveRecipes: [RECIPE_KEYS.Test],
      },
    },
  },
  [ITEM_KEYS.Dagger]: {
    icon: icons.IconDagger,
    iconClass: 'dagger',
    config: {
      key: ITEM_KEYS.Dagger,
      name: 'Dagger',
      stackable: false,
      equipProps: {
        slotKey: EquipmentSlots.Weapon,
        skillKey: SKILL_KEY.Daggers,
        damage: 4,
      },
    },
  },
};
