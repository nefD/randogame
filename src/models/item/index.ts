import {
  ITEM_KEYS,
  ItemDefinition,
  ItemKey,
} from 'data/item.consts';
import { EquipSlotKey } from 'models/character';
import { uuid } from 'utilities/random.utilities';
import { isItemDefinition } from 'utilities/item.utilities';
import { StatsKey } from 'models/character/stats';
import {
  Effect,
  EffectType,
} from 'models/character/effects';
import {SKILL_KEY} from "data/skills.consts";

export interface UsableItemProperties {
  effects: Effect[],
}

export interface ToolItemProperties {
  remainingUses: number;
  maxUses: number;
}

export interface EquipmentBonus {
  statKey: StatsKey;
  modifier: number;
}

export interface EquipmentItemProperties {
  slotKey: EquipSlotKey;
  bonuses?: EquipmentBonus[];
  skillKey?: SKILL_KEY;
  damage?: number;
}

export interface Item {
  name: string;
  key: ItemKey;
  id: string;
  goldValue: number;
  toolProps?: ToolItemProperties;
  equipProps?: EquipmentItemProperties;
  useProps?: UsableItemProperties;
}

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
};
