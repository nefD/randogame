import React from 'react';
import 'features/areaCellDisplay/areaCellDisplay.scss';
import {
  AREA_CELL_TYPES,
  AreaCellDisplayDefs,
} from 'data/areas.consts';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Item } from 'redux/items/items.slice';
import {
  pickUpItemFromCurrentMapCell,
  playerEnteringFacility,
  playerStartCombat,
} from 'redux/character/character.slice';
import { Enemy } from 'redux/enemies/enemies.slice';
import {
  Box,
  Button,
  Flex,
  Stack,
} from '@chakra-ui/core';
import { getPlayerMapPos } from 'redux/character/character.selectors';
import {
  getCurrentCellType,
  getEnemiesAtPlayerPos,
  getItemsAtPlayerPos,
  getTownAtPlayerPos,
} from 'redux/mapAreas/mapAreas.selectors';

export interface AreaCellDisplayProps {
  // areaCell?: AreaCell,
}

export const AreaCellDisplay = () => {
  const dispatch = useDispatch();

  const cellType = useSelector(getCurrentCellType);
  const items = useSelector(getItemsAtPlayerPos);
  const enemies = useSelector(getEnemiesAtPlayerPos);
  const playerPos = useSelector(getPlayerMapPos);
  const town = useSelector(getTownAtPlayerPos);

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
    <Box bg="panelBackground" borderWidth="1px" h="100%">
      <Box p={1} borderBottom="1px solid">
        {playerPos.x}, {playerPos.y} - {areaLabel}
      </Box>

      <Stack p={4} spacing={1} h='15rem' overflowY="auto">
        {items.map(item =>
          <Flex className="areaCellEntity" p={2} direction="row" key={item.id} onClick={() => itemClicked(item)}>
            <Box flex="1" color="white">{item.name}</Box>
            <Button size='sm'>Pick Up</Button>
          </Flex>
        )}
        {enemies.map(enemy =>
          <Flex className="areaCellEntity" p={2} bg="enemyBackground.700" direction="row" key={enemy.id} onClick={() => enemyClicked(enemy)}>
            <Box flex="1" color="white">{enemy.name}</Box>
            <Button size='sm'>Attack</Button>
          </Flex>
        )}
        {town?.facilities.map(facility =>
          <Flex className="areaCellEntity" p={2} bg="facilityBackground.800" direction="row" key={facility.name} onClick={() => dispatch(playerEnteringFacility(facility.id))}>
            <Box flex="1" color="white">{facility.name}</Box>
            <Button size='sm'>Enter</Button>
          </Flex>
        )}
      </Stack>
    </Box>
  )
};
