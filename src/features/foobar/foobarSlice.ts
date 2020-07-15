import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/rootReducer';
import { createSelector } from 'reselect';

type FoobarState = {
  counter: number;
  title: string;
}

const initialState: FoobarState = {
  counter: 0,
  title: 'Foobar!',
};

const foobarSlice = createSlice({
  name: 'foobar',
  initialState,
  reducers: {
    setFoobarCounter(state, action: PayloadAction<number>) {
      state.counter = action.payload;
    }
  }
});

export const getFoobar = (state: RootState) => state.foobar;
export const getFoobarCounter = createSelector(
  getFoobar,
  state => state.counter,
);
export const getFoobarTitle = createSelector(
  getFoobar,
  state => state.title,
);

export const {
  setFoobarCounter,
} = foobarSlice.actions;

export default foobarSlice.reducer;
