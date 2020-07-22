import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { LootTableKey } from 'data/loot.consts';
import { ItemKey } from 'data/item.consts';

export interface ItemToolProperties {
  remainingUses: number;
  maxUses: number;
}

export interface Item {
  name: string;
  key: ItemKey;
  id: string;
  goldValue: number;
  toolProps?: ItemToolProperties;
}

export const itemsAdapter = createEntityAdapter<Item>({
  selectId: item => item.id,
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(),
  reducers: {
    itemCreated: itemsAdapter.addOne,
    toolUsed: {
      reducer(state, { payload: usedItem }: PayloadAction<Item>) {
        const item = state.entities[usedItem.id];
        if (!item || !item.toolProps) return;
        item.toolProps.remainingUses = Math.max(0, item.toolProps.remainingUses - 1);
      },
      prepare(item: Item) {
        return { payload: item };
      },
    }
  },
});

export const itemCreated = itemsSlice.actions.itemCreated;
export const toolUsed = itemsSlice.actions.toolUsed;
export const rollLootTables = createAction<LootTableKey[]>('items/rollLootTables');

export default itemsSlice.reducer;
