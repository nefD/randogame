import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { Enemy } from 'models/enemy';

export const enemiesAdapter = createEntityAdapter<Enemy>({
  selectId: enemy => enemy.id,
});

const enemiesSlice = createSlice({
  name: 'enemies',
  initialState: enemiesAdapter.getInitialState(),
  reducers: {
    enemyCreated: enemiesAdapter.addOne,
    enemyUpdated: enemiesAdapter.upsertOne,
    enemyDeleted: enemiesAdapter.removeOne,
  },
});

export const enemyCreated = enemiesSlice.actions.enemyCreated;
export const enemyUpdated = enemiesSlice.actions.enemyUpdated;
export const enemyDeleted = enemiesSlice.actions.enemyDeleted;
export const enemyAttacked = createAction(
  'enemy/enemyAttacked',
  (enemy: Enemy, damage: number) => ({ payload: { enemy, damage }}),
);
export const enemyKilled = createAction<Enemy>('enemy/enemyKilled');

export default enemiesSlice.reducer;
