import { AREA_CELL_TYPES } from '../../data/areas.consts';
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Item } from '../items/items.slice';

export interface AreaCell {
  id: string;
  x: number;
  y: number;
  type: AREA_CELL_TYPES;
  items: string[];
  enemies: string[];
}

export const areaCellsAdapter = createEntityAdapter<AreaCell>({
  selectId: cell => cell.id,
});

const areaCellsSlice = createSlice({
  name: 'areaCells',
  initialState: areaCellsAdapter.getInitialState(),
  reducers: {
    areaCellAdded: areaCellsAdapter.addOne,
    areaCellsAdded: areaCellsAdapter.addMany,
    removeItemFromAreaCell: {
      reducer(state, {payload: {cell, item}}: PayloadAction<{cell: AreaCell, item: Item}>) {
        const update = {
          ...cell,
          items: cell.items.filter(i => i !== item.id),
        };
        areaCellsAdapter.upsertOne(state, update);
      },
      prepare(cell: AreaCell, item: Item) {
        return {
          payload: { cell, item },
        };
      },
    },
    addItemToAreaCell: {
      reducer(state, {payload: {cell, item}}: PayloadAction<{cell: AreaCell, item: Item}>) {
        const update = {
          ...cell,
          // items: [ ...cell.items, item.id ],
          items: cell.items.concat(item.id),
        };
        areaCellsAdapter.upsertOne(state, update);
      },
      prepare(cell: AreaCell, item: Item) {
        return {
          payload: { cell, item },
        };
      },
    }
  },
});

export const areaCellAdded = areaCellsSlice.actions.areaCellAdded;
export const areaCellsAdded = areaCellsSlice.actions.areaCellsAdded;
export const removeItemFromAreaCell = areaCellsSlice.actions.removeItemFromAreaCell;
export const addItemToAreaCell = areaCellsSlice.actions.addItemToAreaCell;

export default areaCellsSlice.reducer;
