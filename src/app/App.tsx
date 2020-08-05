import React, { useContext, useState } from 'react';
import 'app/App.scss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { CharacterOverview } from 'features/characterOverview/characterOverview';
import { generateMap } from 'redux/mapAreas/mapAreas.slice';
import { ItemDefs } from 'data/items.consts';
import { inventoryAdded } from 'redux/character/character.slice';
import {
  getCharacterName,
  getCurrentMapId, getPlayerClass,
  getPlayerGameState,
  getPlayerIsDead, getPlayerLevel, getPlayerRace,
} from 'redux/character/character.selectors';
import { DeathScreen } from 'features/deathScreen/deathScreen';
import { CharacterGameState } from 'models/character';
import { ItemFactory } from 'models/item';
import { useColorMode, Flex, Box, Stack, Tabs, TabList, Tab, TabPanels, TabPanel, Button, useColorModeValue } from '@chakra-ui/core';
import { ITEM_KEYS } from "data/items.keys";
import { WorldView } from "features/worldView/worldView";
import { CharacterView } from "features/characterView/characterView";
import store, { loadState } from 'app/store';
import LZString from 'lz-string';
import { getLocalStorageItem, setLocalStorageItem } from 'utilities/sessionStorage.utilities';
import { SavedGame, SavedGameFactory } from "models/saves";
import { LoadGame } from "features/loadGame/loadGame";

function App() {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  // const playerGameState = useSelector(getPlayerGameState);
  const playerIsDead = useSelector(getPlayerIsDead);
  const currentMapId = useSelector(getCurrentMapId);

  const [showLoadGame, setShowLoadGame] = useState(false);

  if (!currentMapId) {
    dispatch(generateMap());
    const axe = ItemFactory(ItemDefs[ITEM_KEYS.WoodAxe].config);
    const hat = ItemFactory(ItemDefs[ITEM_KEYS.Hat].config);
    const potion = ItemFactory(ItemDefs[ITEM_KEYS.HealingPotion].config);
    const dagger = ItemFactory(ItemDefs[ITEM_KEYS.Dagger].config);
    const tome = ItemFactory(ItemDefs[ITEM_KEYS.TomeTesting].config);
    dispatch(inventoryAdded([tome, hat, potion, dagger, axe]));
  }

  const saveState = () => {
    const savedGames = getLocalStorageItem<SavedGame[]>('savedGames', []);
    const state = store.getState();
    const stateText = JSON.stringify(state);
    const compressedData = LZString.compress(stateText);
    getCharacterName(state);
    const save = SavedGameFactory({
      compressedData,
      characterInfo: {
        name: getCharacterName(state),
        race: getPlayerRace(state),
        class: getPlayerClass(state),
        level: getPlayerLevel(state),
      }
    });
    savedGames.push(save);
    setLocalStorageItem('savedGames', savedGames);
  };

  const onLoadState = () => {
    setShowLoadGame(!showLoadGame);
  };

  const savedGames = getLocalStorageItem<string[]>('savedGames', []);
  const showLoadButton = savedGames.length > 0;

  const onCloseLoadGame = () => {
    console.log(`onCloseLoadGame`);
    setShowLoadGame(!showLoadGame)
  };

  const overlayBg = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <Box>
      {playerIsDead &&
        <Flex
          p={4}
          bg={overlayBg}
          zIndex={2}
          direction="row" justify="center" align="center"
          position="absolute" w="100%" h="100%"
        >
          <DeathScreen />
        </Flex>
      }

      {showLoadGame &&
        <Flex
          p={4}
          bg={overlayBg}
          zIndex={2}
          direction="row" justify="center" align="center"
          position="absolute" w="100%" h="100%"
        >
          <LoadGame
            onClose={() => onCloseLoadGame()}
          />
        </Flex>
      }

      <Flex p={4} direction="column" align="center">
        <Stack direction="column" spacing={4} w="80vw">
          <Stack direction="row" spacing={2}>
            <Button colorScheme='gray' onClick={toggleColorMode}>
              Toggle {colorMode === "light" ? "Dark" : "Light"}
            </Button>

            <Button onClick={() => saveState()}>Save</Button>

            {showLoadButton && <Button onClick={() => onLoadState()}>Load</Button>}
          </Stack>

          <CharacterOverview />

          <WorldView/>

          <CharacterView/>
        </Stack>
      </Flex>
    </Box>
  );
}

export default App;
