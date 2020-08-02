import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  findFacilityInMapArea,
  fromXY,
} from 'utilities/mapAreas.utilities';
import { NODE_KEYS } from 'data/resources.consts';
import { MapArea } from 'models/map';
import { Enemy } from 'models/enemy';
import { Item } from 'models/item';

export interface ResourceNode {
  id: string;
  name: string;
  key: string;
  type: NODE_KEYS;
  // remaining uses/remaining resources
  remainingResources: number;
}

export const mapAreasAdapter = createEntityAdapter<MapArea>({
  selectId: mapArea => mapArea.id,
});

const mapAreasSlice = createSlice({
  name: 'mapAreas',
  initialState: mapAreasAdapter.getInitialState(),
  reducers: {
    mapAreaUpdated: mapAreasAdapter.upsertOne,
    addItemToMapCell: {
      reducer(state, { payload: { id, x, y, item } }: PayloadAction<{id: string, x: number, y: number, item: Item}>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        const existing = (mapArea.items[idx] || []).find(i => i.key === item.key);
        if (item.stackable && existing) {
          existing.quantity += item.quantity;
          return;
        }
        mapArea.items[idx] = (mapArea.items[idx] || []).concat(item);
        // mapAreasAdapter.upsertOne(state, {
        //   ...mapArea,
        //   items: {
        //     ...mapArea.items,
        //     [idx]: (mapArea.items[idx] || []).concat(item),
        //   },
        // });
      },
      prepare(id: string, x: number, y: number, item: Item) {
        return { payload: { id, x, y, item }};
      },
    },
    addEnemyToMapCell: {
      reducer(state, { payload: { id, x, y, enemy } }: PayloadAction<{id: string, x: number, y: number, enemy: Enemy}>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          enemies: {
            ...mapArea.enemies,
            [idx]: (mapArea.enemies[idx] || []).concat(enemy.id),
          },
        });
      },
      prepare(id: string, x: number, y: number, enemy: Enemy) {
        return { payload: { id, x, y, enemy }};
      },
    },
    addResourceNodeToMapCell: {
      reducer(state, { payload: { id, x, y, resourceNode } }: PayloadAction<{id: string, x: number, y: number, resourceNode: ResourceNode}>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          resourceNodes: {
            ...mapArea.resourceNodes,
            [idx]: (mapArea.resourceNodes[idx] || []).concat(resourceNode),
          },
        });
      },
      prepare(id: string, x: number, y: number, resourceNode: ResourceNode) {
        return { payload: { id, x, y, resourceNode } };
      }
    },
    removeItemFromMapCell: {
      reducer(state, { payload: { id, x, y, item } }: PayloadAction<{id: string, x: number, y: number, item: Item}>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          items: {
            ...mapArea.items,
            [idx]: (mapArea.items[idx] || []).filter(i => i.id !== item.id),
          },
        });
      },
      prepare(id: string, x: number, y: number, item: Item) {
        return { payload: { id, x, y, item }};
      },
    },
    removeEnemyFromMapCell: {
      reducer(state, { payload: { id, x, y, enemy } }: PayloadAction<{ id: string, x: number, y: number, enemy: Enemy }>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          enemies: {
            ...mapArea.enemies,
            [idx]: (mapArea.enemies[idx] || []).filter(id => id !== enemy.id),
          },
        });
      },
      prepare(id: string, x: number, y: number, enemy: Enemy) {
        return { payload: { id, x, y, enemy }};
      },
    },
    removeItemFromShop: {
      reducer(state, { payload: { mapId, facilityId, item } }: PayloadAction<{ mapId: string, facilityId: string, item: Item }>) {
        const mapArea = state.entities[mapId];
        if (!mapArea) return;
        const facility = findFacilityInMapArea(mapArea, facilityId);
        if (!facility) return;
        facility.shopItems = facility.shopItems.filter(i => i.id !== item.id);
      },
      prepare(mapId: string, facilityId: string, item: Item) {
        return { payload: { mapId, facilityId, item } };
      }
    },
    addItemToShop: {
      reducer(state, { payload: { mapId, facilityId, item } }: PayloadAction<{ mapId: string, facilityId: string, item: Item }>) {
        const mapArea = state.entities[mapId];
        if (!mapArea) return;
        const facility = findFacilityInMapArea(mapArea, facilityId);
        if (!facility) return;
        facility.shopItems.push(item);
      },
      prepare(mapId: string, facilityId: string, item: Item) {
        return { payload: { mapId, facilityId, item } };
      },
    },
  },
});

export const generateMap = createAction('mapAreas/generateMap');
export const mapAreaUpdated = mapAreasSlice.actions.mapAreaUpdated;
export const addItemToMapCell = mapAreasSlice.actions.addItemToMapCell;
export const addEnemyToMapCell = mapAreasSlice.actions.addEnemyToMapCell;
export const addResourceNodeToMapCell = mapAreasSlice.actions.addResourceNodeToMapCell;
export const removeItemFromMapCell = mapAreasSlice.actions.removeItemFromMapCell;
export const removeEnemyFromMapCell = mapAreasSlice.actions.removeEnemyFromMapCell;
export const removeItemFromShop = mapAreasSlice.actions.removeItemFromShop;
export const addItemToShop = mapAreasSlice.actions.addItemToShop;
export const spawnMapCell = createAction('mapArea/spawnMapCell');

export type mapAreaActionTypes =
  typeof mapAreaUpdated;

export default mapAreasSlice.reducer;
