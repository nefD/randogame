import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Box,
  Button,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import { getCurrentShopInventory } from 'redux/mapAreas/mapAreas.selectors';
import {
  buyItemFromShop,
  sellItemToShop,
} from 'redux/character/character.slice';
import { getPlayerInventory } from 'redux/character/character.selectors';
import { EntityListItem } from "components/entityListItem/entityListItem";
import { EntityIcon } from "features/common/entityIcon/entityIcon";

export const ShopDisplay = () => {
  const dispatch = useDispatch();
  const shopItems = useSelector(getCurrentShopInventory);
  const playerItems = useSelector(getPlayerInventory);

  return (
    <Stack direction="column" spacing={4} p={2} justify="center">
      <Box>Welcome to the Shop!</Box>
      <Tabs isFitted>
        <TabList>
          <Tab>Buy</Tab>
          <Tab>Sell</Tab>
        </TabList>
        <TabPanels pt={4}>
          <TabPanel>
            <Stack spacing={1}>
              {shopItems?.map(item => (
                <EntityListItem
                  key={item.id}
                  label={`${item.name} (${item.goldValue} Gold)`}
                  icon={<EntityIcon item={item}/>}
                  buttons={<Button onClick={() => dispatch(buyItemFromShop(item))}>Buy</Button>}
                />
              ))}
            </Stack>
          </TabPanel>

          <TabPanel>
            <Stack spacing={1}>
              {playerItems.map(item => (
                <EntityListItem
                  key={item.id}
                  label={`${item.name} (${item.goldValue} Gold)`}
                  icon={<EntityIcon item={item}/>}
                  buttons={<Button onClick={() => dispatch(sellItemToShop(item))}>Sell</Button>}
                />
              ))}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
