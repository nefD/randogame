import { mapAreasAdapter } from './mapAreas.slice';
import {
  getCurrentMapId,
  getPlayerMapLocation,
  getPlayerMapPos,
  getPlayerRace,
} from '../character/character.selectors';
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
import { itemSelectors } from '../items/items.selectors';
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
      // left = Math.min(mapArea.width - 11, Math.max(0, playerPos.x - 5));
      // right = Math.max(11, Math.min(mapArea.width, playerPos.x + 6));
      // top = Math.min(mapArea.height - 11, Math.max(0, playerPos.y - 5));
      // bottom = Math.max(11, Math.min(mapArea.height, playerPos.y + 6));
      left = playerPos.x - 4;
      right = playerPos.x + 5;
      top = playerPos.y - 4;
      bottom = playerPos.y + 5;
    }

    return { left, right, top, bottom };
  }
);

export const getCurrentMapCells = createSelector(
  getCurrentMapArea,
  getMapViewBounds,
  (mapArea, bounds) => {
    const cellTypes: Array<AREA_CELL_TYPES[]> = [];
    if (!mapArea) return cellTypes;

    let n = 0;
    let column: AREA_CELL_TYPES[] = [];
    for (let x = bounds.left; x < bounds.right; x++) {
      column = [];
      for (let y = bounds.top; y < bounds.bottom; y++) {
        if (x < 0 || x > mapArea.width - 1 || y < 0 || y > mapArea.height - 1) {
          column.push(AREA_CELL_TYPES.None);
        } else {
          n = fromXY(x, y, mapArea);
          column.push(mapArea.cellTypes[n]);
        }
      }
      cellTypes.push(column);
    }

    return cellTypes;
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
