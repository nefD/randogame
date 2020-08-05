import React from "react";
import {
  Box,
  Stack,
  Spacer,
  Flex,
  useColorModeValue,
  Button,
} from "@chakra-ui/core";
import {
  getPlayerInventory,
  getPlayerRecipes,
} from "redux/character/character.selectors";
import { useSelector, useDispatch } from "react-redux";
import { CraftingRecipes, RecipeKey } from "data/recipes.consts";
import { getItemDef, ItemDefs } from "data/items.consts";
import { craftRecipe } from "redux/character/character.slice";
import { CraftingRecipeComponent } from "models/item/recipe";
import { recipeIsCraftable } from "utilities/item.utilities";

export function Recipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(getPlayerRecipes);
  const inventory = useSelector(getPlayerInventory);
  const bg = useColorModeValue("yellow.50", "gray.600");

  const renderRecipeRequirement = (requirement: CraftingRecipeComponent) => {
    const styles: any = {};
    const reqItemDef = getItemDef(requirement.itemKey);
    const invItem = inventory.find((i) => i.key === requirement.itemKey);
    if (!invItem || invItem.quantity < requirement.quantity) {
      styles.color = "red";
    }
    return (
      <Box key={requirement.itemKey}
           style={styles}>
        {`${requirement.quantity}x ${reqItemDef.config.name}`}
      </Box>
    );
  };

  const renderRecipe = (recipeKey: RecipeKey) => {
    const recipe = CraftingRecipes[recipeKey];

    return (
      <Stack direction="row"
             align="center"
             key={recipeKey}
             spacing={8}
             p={2}
             bg={bg}>
        <Box>
          {recipe.yields.map((c) => (
            <Box key={c.itemKey}>{`${c.quantity}x ${ItemDefs[c.itemKey].config.name}`}</Box>
          ))}
        </Box>
        <Spacer />
        <Flex direction="column"
              align="flex-end"
              justify="end">
          {recipe.requires.map((c) => renderRecipeRequirement(c))}
        </Flex>
        <Box>
          <Button colorScheme="teal"
                  isDisabled={!recipeIsCraftable(recipeKey, inventory)}
                  onClick={() => dispatch(craftRecipe(recipeKey))}>
            Craft
          </Button>
        </Box>
      </Stack>
    );
  };

  return (
    <Stack spacing={1}>
      {recipes.map((key) => renderRecipe(key))}
    </Stack>
  );
}
