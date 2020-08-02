import React from 'react';
import { MessagesDisplay } from "features/messages/messagesDisplay";
import { InventoryDisplay } from "features/inventory/inventoryDisplay";
import { Equipment } from "features/equipment/equipment";
import { Skills } from "features/skills/skills";
import { Abilities } from "features/abilities/abilities";
import { Recipes } from "features/recipes/recipes";
import { Card } from "components/card";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/core';

export const CharacterView = () => {
  return (
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
  );
};
