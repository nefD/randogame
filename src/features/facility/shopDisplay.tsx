import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Box,
  Button,
  Flex,
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
                <Flex key={item.id} bg="shopItemBackground" p={1} align="center">
                  <Box px={2} flex="1" color="white">{item.name}</Box>
                  <Box px={4} color="white">{item.goldValue} Gold</Box>
                  <Box><Button onClick={() => dispatch(buyItemFromShop(item))}>Buy</Button></Box>
                </Flex>
              ))}
            </Stack>
          </TabPanel>

          <TabPanel>
            <Stack spacing={1}>
              {playerItems.map(item => (
                <Flex key={item.id} bg="shopItemBackground" p={1} align="center">
                  <Box px={2} flex="1" color="white">{item.name}</Box>
                  <Box px={4} color="white">{item.goldValue} Gold</Box>
                  <Box><Button onClick={() => dispatch(sellItemToShop(item))}>Sell</Button></Box>
                </Flex>
              ))}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
