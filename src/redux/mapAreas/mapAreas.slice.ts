import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  findFacilityInMapArea,
  fromXY,
  findResourceNodeInMapArea,
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
    addItemsToMapCell: {
      reducer(state, { payload: { id, x, y, items } }: PayloadAction<{id: string, x: number, y: number, items: Item[]}>) {
          items.forEach(item => {
          const mapArea = state.entities[id];
          if (!mapArea) return;
          const idx = fromXY(x, y, mapArea);
          const existing = (mapArea.items[idx] || []).find(i => i.key === item.key);
          if (item.stackable && existing) {
            existing.quantity += item.quantity;
            return;
          }
          mapArea.items[idx] = (mapArea.items[idx] || []).concat(item);
        });
      },
      prepare(id: string, x: number, y: number, items: Item[]) {
        return { payload: { id, x, y, items }};
      },
    },
    addEnemyToMapCell: {
      reducer(state, { payload: { id, x, y, enemy } }: PayloadAction<{id: string, x: number, y: number, enemy: Enemy}>) {

        console.log(`addEnemyToMapCell`);

        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);

        console.log(`updating enemies to:`, {
          ...mapArea.enemies,
          [idx]: (mapArea.enemies[idx] || []).concat(enemy),
        });

        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          enemies: {
            ...mapArea.enemies,
            [idx]: (mapArea.enemies[idx] || []).concat(enemy),
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
            [idx]: (mapArea.enemies[idx] || []).filter(e => e.id !== enemy.id),
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
    updateResourceNode: {
      reducer(state, { payload: { mapId, nodeId, node } }: PayloadAction<{ mapId: string, nodeId: string, node: Partial<ResourceNode> }>) {
        const mapArea = state.entities[mapId];
        if (!mapArea) return;
        const resourceNode = findResourceNodeInMapArea(mapArea, nodeId);
        if (!resourceNode) return;
        console.log(`found resource node to update:`, resourceNode);
        Object.assign(resourceNode, node);
      },
      prepare(mapId: string, nodeId: string, node: Partial<ResourceNode>) {
        return { payload: { mapId, nodeId, node } };
      }
    },
    removeResourceNode: {
      reducer(state, { payload: { mapId, nodeId } }: PayloadAction<{ mapId: string, nodeId: string}>) {
        const mapArea = state.entities[mapId];
        if (!mapArea) return;
        Object.keys(mapArea.resourceNodes)
          .filter(key => mapArea.resourceNodes[key].some(n => n.id === nodeId))
          .map(nodesKey => mapArea.resourceNodes[nodesKey] = mapArea.resourceNodes[nodesKey].filter(n => n.id !== nodeId));
      },
      prepare(mapId: string, nodeId: string) {
        return { payload: { mapId, nodeId } };
      }
    }
  },
});

export const generateMap = createAction('mapAreas/generateMap');
export const mapAreaUpdated = mapAreasSlice.actions.mapAreaUpdated;
export const addItemsToMapCell = mapAreasSlice.actions.addItemsToMapCell;
export const addEnemyToMapCell = mapAreasSlice.actions.addEnemyToMapCell;
export const addResourceNodeToMapCell = mapAreasSlice.actions.addResourceNodeToMapCell;
export const removeItemFromMapCell = mapAreasSlice.actions.removeItemFromMapCell;
export const removeEnemyFromMapCell = mapAreasSlice.actions.removeEnemyFromMapCell;
export const removeItemFromShop = mapAreasSlice.actions.removeItemFromShop;
export const updateResourceNode = mapAreasSlice.actions.updateResourceNode;
export const addItemToShop = mapAreasSlice.actions.addItemToShop;
export const refreshMapCell = createAction('mapArea/refreshMapCell');
export const refreshMapCellResources = createAction('mapArea/refreshMapCellResources');
export const refreshMapCellSpawns = createAction('mapArea/refreshMapCellSpawns');
export const removeResourceNode = mapAreasSlice.actions.removeResourceNode;

export type mapAreaActionTypes =
  typeof mapAreaUpdated;

export default mapAreasSlice.reducer;
