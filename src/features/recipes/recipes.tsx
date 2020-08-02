import React from 'react';
import { Box, Stack, Spacer, Flex, useColorModeValue, Button } from '@chakra-ui/core';
import { getPlayerRecipes } from "redux/character/character.selectors";
import { useSelector, useDispatch } from 'react-redux';
import { CraftingRecipes, RecipeKey } from "data/recipes.consts";
import { ItemDefs } from "data/item.consts";
import { craftRecipe } from "redux/character/character.slice";


export function Recipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(getPlayerRecipes);
  const bg = useColorModeValue("yellow.50", "gray.600");

  const renderRecipe = (recipeKey: RecipeKey) => {
    const recipe = CraftingRecipes[recipeKey];

    return (
      <Stack direction='row' align='center' key={recipeKey} spacing={8}>
        <Box>
          {recipe.yields.map(c =>
            <Box>{`${c.amount}x ${ItemDefs[c.itemKey].config.name}`}</Box>
          )}
        </Box>
        <Spacer/>
        <Flex direction='column' align='flex-end' justify='end'>
          <Box>Long line of text here</Box>
          {recipe.requires.map(c =>
            <Box>{`${c.amount}x ${ItemDefs[c.itemKey].config.name}`}</Box>
          )}
        </Flex>
        <Box>
          <Button colorScheme='teal' onClick={() => dispatch(craftRecipe(recipeKey))}>Craft</Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      {recipes.map(key =>
        <Box p={2} bg={bg}>{renderRecipe(key)}</Box>
      )}
    </Stack>
  );
}
