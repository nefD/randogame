import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  AREA_CELL_TYPES,
  FACILITY_TYPE,
} from 'data/areas.consts';
import { Item } from 'redux/items/items.slice';
import { Enemy } from 'redux/enemies/enemies.slice';
import { fromXY } from 'utilities/mapAreas.utilities';
import { CHARACTER_RACE } from 'data/races.consts';

export interface Facility {
  id: string;
  name: string;
  type: FACILITY_TYPE;
}

export interface Town {
  race: CHARACTER_RACE;
  facilities: Facility[];
}

export interface MapArea {
  id: string;
  name: string;
  width: number;
  height: number;
  cellTypes: AREA_CELL_TYPES[];
  items: { [key: string]: string[] };
  enemies: { [key: string]: string[] };
  towns: { [key: string]: Town };
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
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          items: {
            ...mapArea.items,
            [idx]: (mapArea.items[idx] || []).concat(item.id),
          },
        });
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
    removeItemFromMapCell: {
      reducer(state, { payload: { id, x, y, item } }: PayloadAction<{id: string, x: number, y: number, item: Item}>) {
        const mapArea = state.entities[id];
        if (!mapArea) return;
        const idx = fromXY(x, y, mapArea);
        mapAreasAdapter.upsertOne(state, {
          ...mapArea,
          items: {
            ...mapArea.items,
            [idx]: (mapArea.items[idx] || []).filter(id => id !== item.id),
          },
        });
      },
      prepare(id: string, x: number, y: number, item: Item) {
        return { payload: { id, x, y, item }};
      },
    },
    removeEnemyFromMapCell: {
      reducer(state, { payload: { id, x, y, enemy } }: PayloadAction<{id: string, x: number, y: number, enemy: Enemy}>) {
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
    }
  },
});

export const generateMap = createAction('mapAreas/generateMap');
export const mapAreaUpdated = mapAreasSlice.actions.mapAreaUpdated;
export const addItemToMapCell = mapAreasSlice.actions.addItemToMapCell;
export const addEnemyToMapCell = mapAreasSlice.actions.addEnemyToMapCell;
export const removeItemFromMapCell = mapAreasSlice.actions.removeItemFromMapCell;
export const removeEnemyFromMapCell = mapAreasSlice.actions.removeEnemyFromMapCell;

export type mapAreaActionTypes =
  typeof mapAreaUpdated;

export default mapAreasSlice.reducer;
