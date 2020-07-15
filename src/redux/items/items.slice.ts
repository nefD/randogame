import {
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

export interface Item {
  name: string;
  id: string;
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

export const {
  itemCreated,
} = itemsSlice.actions;

export default itemsSlice.reducer;
