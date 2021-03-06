import React from 'react';
import 'features/areaCell/areaCellDisplay.scss';
import { AreaCellDisplayDefs } from 'data/areas.consts';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  harvestResourceNode,
  pickUpItemFromCurrentMapCell,
  playerEnteringFacility,
  playerStartCombat,
} from 'redux/character/character.slice';
import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import {
  getPlayerCanHarvestResources,
  getPlayerMapPos,
} from 'redux/character/character.selectors';
import {
  getCurrentCellType,
  getEnemiesAtPlayerPos,
  getItemsAtPlayerPos,
  getResourceNodesAtPlayerPos,
  getTownAtPlayerPos,
} from 'redux/mapAreas/mapAreas.selectors';
import { EntityIcon } from 'features/common/entityIcon/entityIcon';
import { Card } from 'components/card';
import { EntityListItem } from "components/entityListItem/entityListItem";

export const AreaCellDisplay = () => {
  const dispatch = useDispatch();
  const cellType = useSelector(getCurrentCellType);
  const items = useSelector(getItemsAtPlayerPos);
  const enemies = useSelector(getEnemiesAtPlayerPos);
  const playerPos = useSelector(getPlayerMapPos);
  const town = useSelector(getTownAtPlayerPos);
  const resourceNodes = useSelector(getResourceNodesAtPlayerPos);
  const canHarvest = useSelector(getPlayerCanHarvestResources);

  let areaName = AreaCellDisplayDefs[cellType].name;
  if (town) {
    areaName = `${areaName} [${town.race}]`;
  }

  const areaLabel = (
    <span>
      {areaName}
    </span>
  );

  return (
    <Card>
      <Box h="100%" overflowY="auto">
        <Box p={1} borderBottomWidth='1px'>
          {playerPos.x}, {playerPos.y} - {areaLabel}
        </Box>

        <Stack p={1} spacing={1} overflowY="auto">
          {enemies.map(enemy =>
            <EntityListItem
              key={enemy.id}
              label={enemy.name}
              buttons={<Button colorScheme='red' onClick={() => dispatch(playerStartCombat(enemy))}>Attack</Button>}/>
          )}
          {town?.facilities.map(facility =>
            <EntityListItem
              key={facility.name}
              label={facility.name}
              icon={<EntityIcon facility={facility} />}
              buttons={<Button onClick={() => dispatch(playerEnteringFacility(facility.id))}>Enter</Button>}/>
          )}
          {resourceNodes.map((node, nodeIdx) =>
            <EntityListItem
              key={nodeIdx}
              label={node.name}
              icon={<EntityIcon resourceNode={node} />}
              buttons={<Button isDisabled={!canHarvest[node.type]} onClick={() => dispatch(harvestResourceNode(node.id))}>Harvest</Button>}/>
          )}
          {items.map(item =>
            <EntityListItem
              key={item.id}
              label={`${item.name} (Qty: ${item.quantity})`}
              icon={<EntityIcon item={item} />}
              buttons={<Button onClick={() => dispatch(pickUpItemFromCurrentMapCell(item))} colorScheme="teal" variant="solid">Pick Up</Button>}/>
          )}
        </Stack>
      </Box>
    </Card>
  )
};
