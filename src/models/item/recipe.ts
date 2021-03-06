import { SkillKey } from "data/skills.consts";
import { ItemKey } from "data/items.keys";

export interface CraftingRecipeComponent {
  itemKey: ItemKey;
  quantity: number;
}

export interface CraftingRecipe {
  skillKey?: SkillKey;
  requires: CraftingRecipeComponent[];
  yields: CraftingRecipeComponent[];
}
