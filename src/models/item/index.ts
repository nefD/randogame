import {
  ITEM_KEYS,
  ItemDefinition,
  ItemKey,
} from 'data/item.consts';
import { EquipSlotKey } from 'models/character';
import { uuid } from 'utilities/random.utilities';
import { isItemDefinition } from 'utilities/item.utilities';
import { StatsKey } from 'models/character/stats';

export interface ItemToolProperties {
  remainingUses: number;
  maxUses: number;
}

export interface EquipmentBonus {
  statKey: StatsKey;
  modifier: number;
}

export interface ItemEquipmentProperties {
  slotKey: EquipSlotKey;
  bonuses?: EquipmentBonus[];
}

export interface Item {
  name: string;
  key: ItemKey;
  id: string;
  goldValue: number;
  toolProps?: ItemToolProperties;
  equipProps?: ItemEquipmentProperties;
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
