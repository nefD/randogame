import React, { useEffect } from 'react';
import 'app/App.scss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { MapDisplay } from 'features/map/mapDisplay';
import { CharacterOverview } from 'features/characterOverview/characterOverview';
import { generateMap } from 'redux/mapAreas/mapAreas.slice';
import { AreaCellDisplay } from 'features/areaCell/areaCellDisplay';
import { InventoryDisplay } from 'features/inventory/inventoryDisplay';
import {
  ItemDefs,
} from 'data/item.consts';
import { itemCreated } from 'redux/items/items.slice';
import {
  addAbilities,
  inventoryAdded,

} from 'redux/character/character.slice';
import {
  getCurrentMapId,
  getPlayerGameState,
  getPlayerIsDead,
} from 'redux/character/character.selectors';
import { CombatDisplay } from 'features/combat/combatDisplay';
// import customTheme from 'theme';
// import theme from 'chakra';
import theme from "@chakra-ui/theme"
import { getCurrentMapArea } from 'redux/mapAreas/mapAreas.selectors';
import { DeathScreen } from 'features/deathScreen/deathScreen';
import { FacilityDisplay } from 'features/facility/facilityDisplay';
import { MessagesDisplay } from 'features/messages/messagesDisplay';
import { Skills } from 'features/skills/skills';
import { Equipment } from 'features/equipment/equipment';
import { CharacterGameState } from 'models/character';
import { ItemFactory } from 'models/item';
import { useColorMode, ChakraProvider, CSSReset, Flex, Box, Stack, Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@chakra-ui/core';
import { Card } from 'components/card';
import { MapNavigation } from 'features/map/mapNavigation';
import {Resizable} from "re-resizable";
import {ABILITY_KEY} from "data/abilities.consts";
import { Abilities } from "features/abilities/abilities";
import { ITEM_KEYS } from "data/item.keys";
import { Recipes } from "features/recipes/recipes";
// import Button from 'chakra/components/button';

function App() {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  const playerGameState = useSelector(getPlayerGameState);
  const playerIsDead = useSelector(getPlayerIsDead);
  const currentMapId = useSelector(getCurrentMapId);

  if (!currentMapId) {
    dispatch(generateMap());
    const axe = ItemFactory(ItemDefs[ITEM_KEYS.WoodAxe].config);
    dispatch(itemCreated(axe));
    dispatch(inventoryAdded(axe));

    const hat = ItemFactory(ItemDefs[ITEM_KEYS.Hat].config);
    dispatch(itemCreated(hat));
    dispatch(inventoryAdded(hat));

    const potion = ItemFactory(ItemDefs[ITEM_KEYS.HealingPotion].config);
    dispatch(itemCreated(potion));
    dispatch(inventoryAdded(potion));

    const dagger = ItemFactory(ItemDefs[ITEM_KEYS.Dagger].config);
    dispatch(itemCreated(dagger));
    dispatch(inventoryAdded(dagger));

    const tome = ItemFactory(ItemDefs[ITEM_KEYS.TomeTesting].config);
    dispatch(itemCreated(tome));
    dispatch(inventoryAdded(tome));
  }

  let mainDisplay;
  switch (playerGameState) {
    case CharacterGameState.Facility: {
      mainDisplay = (
        <Flex direction="row"><Box flex="1"><FacilityDisplay /></Box></Flex>
      );
      break;
    }
    case CharacterGameState.Combat: {
      mainDisplay = (
        <Card>
          <Flex direction="row"><Box flex="1"><CombatDisplay /></Box></Flex>
        </Card>
      );
      break;
    }
    case CharacterGameState.Travel:
    default: {
      mainDisplay = (
        <Stack maxH="50vw" overflowY="auto" direction="row" spacing={4}>
          <Card>
            <MapDisplay/>
            <MapNavigation/>
          </Card>
          <Box flex="1"><AreaCellDisplay /></Box>
        </Stack>
      );
      break;
    }
  }

  return (
    <Box>
      {playerIsDead &&
        <Flex
          p={4}
          bg="deathBackground"
          zIndex={1}
          direction="row" justify="center" align="center"
          position="absolute" w="100%" h="100%"
        >
          <DeathScreen />
        </Flex>
      }

      <Flex p={4} direction="row" justify="center">
        <Button colorScheme='red' onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>

        <Stack direction="column" spacing={4} w="80vw">
          <Box><CharacterOverview /></Box>

          <Box>
            {mainDisplay}
          </Box>

          {/*<Box>*/}
          {/*<Resizable>*/}
          {playerGameState !== CharacterGameState.Combat &&
            <Card>
              <Tabs variant="line" flex='1'>
                <TabList>
                  <Tab>Messages</Tab>
                  <Tab>Inventory</Tab>
                  <Tab>Equipment</Tab>
                  <Tab>Skills</Tab>
                  <Tab>Abilities</Tab>
                  <Tab>Recipes</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <MessagesDisplay/>
                  </TabPanel>

                  <TabPanel>
                    <InventoryDisplay/>
                  </TabPanel>

                  <TabPanel>
                    <Equipment/>
                  </TabPanel>

                  <TabPanel>
                    <Skills/>
                  </TabPanel>

                  <TabPanel>
                    <Abilities/>
                  </TabPanel>

                    <TabPanel>
                      <Recipes/>
                    </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          }
          {/*</Resizable>*/}
          {/*</Box>*/}
        </Stack>
      </Flex>
    </Box>
  );
}


export default App;
