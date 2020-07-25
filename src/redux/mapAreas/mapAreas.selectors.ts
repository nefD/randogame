import { mapAreasAdapter } from './mapAreas.slice';
import {
  getCurrentMapId,
  getPlayerMapLocation,
  getPlayerMapPos,
  getPlayerRace,
} from 'redux/character/character.selectors';
import { createSelector } from 'reselect';
import {
  getEnemiesState,
  getItemsState,
  getMapAreasState,
} from 'app/baseSelectors';
import {
  AREA_CELL_TYPES,
  FACILITY_TYPE,
} from 'data/areas.consts';
import { fromXY } from 'utilities/mapAreas.utilities';
import { itemSelectors } from 'redux/items/items.selectors';
import { enemiesSelectors } from 'redux/enemies/enemies.selectors';
import { Enemy } from 'models/enemy';
import { Item } from 'models/item';

export const {
  selectById: selectMapAreaById,
} = mapAreasAdapter.getSelectors();

export const getCurrentMapArea = createSelector(
  getMapAreasState,
  getCurrentMapId,
  (state, mapId) => selectMapAreaById(state, mapId)
);

export const getCurrentMapAreaWidth = createSelector(
  getCurrentMapArea,
  (state) => state?.width || 0,
);

export const getCurrentMapAreaHeight = createSelector(
  getCurrentMapArea,
  (state) => state?.height || 0,
);

export const getCurrentCellType = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  (mapArea, playerPos) => mapArea?.cellTypes[fromXY(playerPos.x, playerPos.y, mapArea)] || AREA_CELL_TYPES.None,
);

export const getMapViewBounds = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  (mapArea, playerPos) => {
    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;

    if (mapArea) {
      left = playerPos.x - 3;
      right = playerPos.x + 4;
      top = playerPos.y - 3;
      bottom = playerPos.y + 4;
    }

    return { left, right, top, bottom };
  }
);

export const getCurrentMapSize = createSelector(
  getCurrentMapArea,
  (mapArea) => ({ width: mapArea?.width || 0, height: mapArea?.height || 0 }),
);

export const getCurrentMapCellTypes = createSelector(
  getCurrentMapArea,
  (mapArea) => mapArea?.cellTypes || [],
);

export const getCurrentMapCells = createSelector(
  getCurrentMapSize,
  getCurrentMapCellTypes,
  getMapViewBounds,
  (mapSize, cellTypes, bounds) => {
    const cells: Array<AREA_CELL_TYPES[]> = [];
    let n = 0;
    let column: AREA_CELL_TYPES[] = [];
    for (let x = bounds.left; x < bounds.right; x++) {
      column = [];
      for (let y = bounds.top; y < bounds.bottom; y++) {
        if (x < 0 || x > mapSize.width - 1 || y < 0 || y > mapSize.height - 1) {
          column.push(AREA_CELL_TYPES.None);
        } else {
          n = fromXY(x, y, mapSize.width);
          column.push(cellTypes[n]);
        }
      }
      cells.push(column);
    }
    return cells;
  },
);

export const getTranslatedPlayerMapPos = createSelector(
  getMapViewBounds,
  getPlayerMapPos,
  (bounds, playerPos) => ({ x: playerPos.x - bounds.left, y: playerPos.y - bounds.top }),
);

export const getItemsAtPlayerPos = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  getItemsState,
  (mapArea, playerPos, itemsState) =>
    (mapArea?.items[fromXY(playerPos.x, playerPos.y, mapArea)] || [])
      .reduce((list: Item[], id: string) => list.concat(itemSelectors.selectById(itemsState, id) || []), []),
);

export const getEnemiesAtPlayerPos = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  getEnemiesState,
  (mapArea, playerPos, enemiesState) =>
    (mapArea?.enemies[fromXY(playerPos.x, playerPos.y, mapArea)] || [])
      .reduce((list: Enemy[], id: string) => list.concat(enemiesSelectors.selectById(enemiesState, id) || []), []),
);

export const getResourceNodesAtPlayerPos = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  (mapArea, playerPos) => mapArea?.resourceNodes[fromXY(playerPos.x, playerPos.y, mapArea)] || [],
);

export const getTownAtPlayerPos = createSelector(
  getCurrentMapArea,
  getPlayerMapPos,
  (mapArea, playerPos) => mapArea?.towns[fromXY(playerPos.x, playerPos.y, mapArea)],
);

export const getPlayersCurrentFacility = createSelector(
  getTownAtPlayerPos,
  getPlayerMapLocation,
  (town, location) => town?.facilities.find(f => f.id === location.facilityId),
);

export const getCurrentShopInventory = createSelector(
  getPlayersCurrentFacility,
  getItemsState,
  (facility, itemsState) =>
    (facility && facility.type === FACILITY_TYPE.Shop)
      ? facility.shopItems.reduce((list: Item[], id: string) => list.concat(itemSelectors.selectById(itemsState, id) || []), [])
      : null,
);

export const getPlayerInnCost = createSelector(
  getTownAtPlayerPos,
  getPlayerRace,
  (town, race) => 50,
);

export const getPlayerTavernCost = createSelector(
  getTownAtPlayerPos,
  getPlayerRace,
  (town, race) => 50,
);
