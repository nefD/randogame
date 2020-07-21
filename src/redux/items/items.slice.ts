import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { LootTableKey } from 'data/loot.consts';
import { ItemKey } from 'data/item.consts';

export interface Item {
  name: string;
  key: string;
  id: string;
  value: number;
}

export const itemsAdapter = createEntityAdapter<Item>({
  selectId: item => item.id,
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(),
  reducers: {
    itemCreated: itemsAdapter.addOne,
  },
});

export const itemCreated = itemsSlice.actions.itemCreated;
export const rollLootTables = createAction<LootTableKey[]>('items/rollLootTables');

export default itemsSlice.reducer;
