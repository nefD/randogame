import React, { useContext } from 'react';
import 'app/App.scss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { CharacterOverview } from 'features/characterOverview/characterOverview';
import { generateMap } from 'redux/mapAreas/mapAreas.slice';
import { ItemDefs } from 'data/item.consts';
import { inventoryAdded } from 'redux/character/character.slice';
import {
  getCurrentMapId,
  getPlayerGameState,
  getPlayerIsDead,
} from 'redux/character/character.selectors';
import { DeathScreen } from 'features/deathScreen/deathScreen';
import { CharacterGameState } from 'models/character';
import { ItemFactory } from 'models/item';
import { useColorMode, Flex, Box, Stack, Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@chakra-ui/core';
import { ITEM_KEYS } from "data/item.keys";
import { WorldView } from "features/worldView/worldView";
import { CharacterView } from "features/characterView/characterView";
import store, { loadState } from 'app/store';
import LZString from 'lz-string';
import { getLocalStorageItem, setLocalStorageItem } from 'utilities/sessionStorage.utilities';

function App() {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  const playerGameState = useSelector(getPlayerGameState);
  const playerIsDead = useSelector(getPlayerIsDead);
  const currentMapId = useSelector(getCurrentMapId);

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
    const savedGames = getLocalStorageItem<string[]>('savedGames', []);
    const state = store.getState();
    const stateText = JSON.stringify(state);
    const compressed = LZString.compress(stateText);
    savedGames.push(compressed);
    setLocalStorageItem('savedGames', savedGames);
  };

  const onLoadState = () => {
    const savedGames = getLocalStorageItem<string[]>('savedGames', []);
    if (!savedGames.length) return;
    const saveText = savedGames[savedGames.length - 1];
    const stateText = LZString.decompress(saveText);
    const stateObj = JSON.parse(stateText || '');
    dispatch(loadState(stateObj));
  };

  const savedGames = getLocalStorageItem<string[]>('savedGames', []);
  const showLoad = savedGames.length > 0;

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

      <Flex p={4} direction="column" align="center">
        <Stack direction="column" spacing={4} w="80vw">
          <Box>
            <Button colorScheme='gray' onClick={toggleColorMode}>
              Toggle {colorMode === "light" ? "Dark" : "Light"}
            </Button>

            <Button onClick={() => saveState()}>Save</Button>

            {showLoad && <Button onClick={() => onLoadState()}>Load</Button>}
          </Box>

          <CharacterOverview />

          <WorldView/>

          <CharacterView/>
        </Stack>
      </Flex>
    </Box>
  );
}

export default App;
