import {
  ItemDefinition,

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
import { AbilityKey } from "data/abilities.consts";
import { CraftingRecipe } from "models/item/recipe";
import { RecipeKey } from "data/recipes.consts";
import { ITEM_KEYS, ItemKey } from "data/item.keys";

export interface UsableItemProperties {
  effects?: Effect[];
  giveAbilities?: AbilityKey[];
  giveRecipes?: RecipeKey[];
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
  stackable: boolean;
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
    stackable: false,
    ...config,
  };
};
