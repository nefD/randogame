import { ItemDefinition } from 'data/item.consts';
import { Item } from 'models/item';
import { between } from "utilities/random.utilities";
import { CraftingRecipes, RecipeKey } from "data/recipes.consts";

export const isItemDefinition = (i: Partial<Item> | ItemDefinition): i is ItemDefinition => {
  return (i as ItemDefinition).config !== undefined;
};

export const rollWeaponDamage = (weapon?: Item | null) => {
  if (!weapon || !weapon.equipProps?.damage) return 0;
  const dmg = between(weapon.equipProps.damage / 2, weapon.equipProps.damage);
  console.log(`rolled weapon damage for ${weapon.name}: ${dmg}`);
  return dmg;
};

// @TODO - Finish me!
// export const recipeIsCraftable = (recipeKey: RecipeKey, inventory: Item[]): boolean => {
//   return CraftingRecipes[recipeKey].requires.every(c => inventory.find(i => i.key === c.itemKey).
//
// };
