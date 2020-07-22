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
import { ItemFactory } from 'utilities/item.utilities';
import {
  ITEM_KEYS,
  ItemDefs,
} from 'data/item.consts';
import { itemCreated } from 'redux/items/items.slice';
import {
  inventoryAdded,
  CharacterGameState,
} from 'redux/character/character.slice';
import {
  getPlayerGameState,
  getPlayerIsDead,
} from 'redux/character/character.selectors';
import { CombatDisplay } from 'features/combat/combatDisplay';
import {
  Box,
  CSSReset,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  ThemeProvider,
} from '@chakra-ui/core';
import customTheme from 'theme';
import { getCurrentMapArea } from 'redux/mapAreas/mapAreas.selectors';
import { DeathScreen } from 'features/deathScreen/deathScreen';
import { FacilityDisplay } from 'features/facility/facilityDisplay';
import { MessagesDisplay } from 'features/messages/messagesDisplay';
import { Skills } from 'features/skills';

function App() {
  const dispatch = useDispatch();

  const playerGameState = useSelector(getPlayerGameState);
  const playerIsDead = useSelector(getPlayerIsDead);

  const mapArea = useSelector(getCurrentMapArea);
  if (!mapArea) {
    dispatch(generateMap());
    const item = ItemFactory(ItemDefs[ITEM_KEYS.WoodAxe].config);
    dispatch(itemCreated(item));
    dispatch(inventoryAdded(item));
  }

  useEffect(() => {
    return () => {
      console.log(`running useEffect cleanup`);
    };
  }, []);

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
        <Flex direction="row"><Box flex="1"><CombatDisplay /></Box></Flex>
      );
      break;
    }
    case CharacterGameState.Travel:
    default: {
      mainDisplay = (
        <Stack maxH="50vw" overflowY="auto" direction="row" spacing={4}>
          <Box><MapDisplay/></Box>
          <Box flex="1"><AreaCellDisplay /></Box>
        </Stack>
      );
      break;
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
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
        <Stack direction="column" spacing={4} w="80vw">
          <Box><CharacterOverview /></Box>

          <Box>
            {mainDisplay}
          </Box>

          <Tabs variant="line" isFitted={true}>
            <TabList color="white">
              <Tab>Messages</Tab>
              <Tab>Inventory</Tab>
              <Tab>Skills</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <MessagesDisplay/>
              </TabPanel>

              <TabPanel>
                <Box bg="panelBackground" borderWidth="1px" borderTop="none" p={4}>
                  <InventoryDisplay/>
                </Box>
              </TabPanel>

              <TabPanel>
                <Skills/>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Stack>
      </Flex>
    </ThemeProvider>
  );
}


export default App;
