import React, { useContext } from 'react';
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
  Flex,
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
import { EntityIcon } from 'features/common/entityIcon';
import { Enemy } from 'models/enemy';
import { Item } from 'models/item';

export const AreaCellDisplay = () => {
  const dispatch = useDispatch();

  const cellType = useSelector(getCurrentCellType);
  const items = useSelector(getItemsAtPlayerPos);
  const enemies = useSelector(getEnemiesAtPlayerPos);
  const playerPos = useSelector(getPlayerMapPos);
  const town = useSelector(getTownAtPlayerPos);
  const resourceNodes = useSelector(getResourceNodesAtPlayerPos);
  const canHarvest = useSelector(getPlayerCanHarvestResources);

  const itemClicked = (item: Item) => {
    dispatch(pickUpItemFromCurrentMapCell(item));
  };

  const enemyClicked = (enemy: Enemy) => {
    dispatch(playerStartCombat(enemy));
  };

  let areaName = AreaCellDisplayDefs[cellType].name;
  if (town) {
    areaName = `${areaName} [${town.race}]`;
  }
  const areaLabel = (
    <span className={AreaCellDisplayDefs[cellType].cssClass}>
      {areaName}
    </span>
  );

  return (
    <Box bg="panelBackground" borderWidth="1px" h="100%" overflowY="auto">
      <Box p={1} borderBottom="1px solid">
        {playerPos.x}, {playerPos.y} - {areaLabel}
      </Box>

      <Stack p={4} spacing={1} overflowY="auto">
        {enemies.map(enemy =>
          <Flex className="areaCellEntity" p={2} bg="enemyBackground.700" direction="row" key={enemy.id} onClick={() => enemyClicked(enemy)}>
            <Box flex="1" color="white">{enemy.name}</Box>
            <Button size='sm'>Attack</Button>
          </Flex>
        )}
        {town?.facilities.map(facility =>
          <Flex className="areaCellEntity" p={2} bg="facilityBackground.800" direction="row" key={facility.name} onClick={() => dispatch(playerEnteringFacility(facility.id))}>
            <EntityIcon facility={facility} />
            <Box flex="1" color="white">{facility.name}</Box>
            <Button size='sm'>Enter</Button>
          </Flex>
        )}
        {resourceNodes.map((node, nodeIdx) =>
          <Flex className="areaCellEntity" p={2} direction="row" align="center" key={nodeIdx}>
            <EntityIcon resourceNode={node} />
            <Box flex="1" color="white">
              {node.name}
            </Box>
            <Button isDisabled={!canHarvest[node.type]} size='sm' onClick={() => dispatch(harvestResourceNode(node.id))}>Harvest</Button>
          </Flex>
        )}
        {items.map(item =>
          <Flex className="areaCellEntity" p={2} direction="row" align="center" key={item.id} onClick={() => itemClicked(item)}>
            <EntityIcon item={item} />
            <Box flex="1" color="white">
              <span>{item.name}</span>
            </Box>
            <Button size='sm'>Pick Up</Button>
          </Flex>
        )}
      </Stack>
    </Box>
  )
};
