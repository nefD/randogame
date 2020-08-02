import { CraftingRecipe } from "models/item/recipe";
import { ITEM_KEYS } from "data/item.keys";


export enum RECIPE_KEYS {
  Empty = 'Empty',
  Test = 'Test',
}

export type RecipeKey = keyof typeof RECIPE_KEYS;

export const CraftingRecipes: { [key in RECIPE_KEYS]: CraftingRecipe } = {
  [RECIPE_KEYS.Empty]: {
    requires: [],
    yields: [],
  },
  [RECIPE_KEYS.Test]: {
    requires: [
      { itemKey: ITEM_KEYS.Stick, quantity: 2 },
      { itemKey: ITEM_KEYS.Sand, quantity: 1 },
    ],
    yields: [
      { itemKey: ITEM_KEYS.Wood, quantity: 1 },
    ],
  },
};

export const getRecipe = (key: RecipeKey) => CraftingRecipes[key];
