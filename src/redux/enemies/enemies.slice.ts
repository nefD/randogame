import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { MapLocation } from '../../data/commonTypes';

export interface Enemy {
  id: string;
  name: string;
  location: MapLocation;
  health: number;
  maxHealth: number;
}

export const enemiesAdapter = createEntityAdapter<Enemy>({
  selectId: enemy => enemy.id,
});

const enemiesSlice = createSlice({
  name: 'enemies',
  initialState: enemiesAdapter.getInitialState(),
  reducers: {
    enemyCreated: enemiesAdapter.addOne,
    enemyUpdated: enemiesAdapter.upsertOne,
    enemyKilled: enemiesAdapter.removeOne,
  },
});

export const enemyCreated = enemiesSlice.actions.enemyCreated;
export const enemyUpdated = enemiesSlice.actions.enemyUpdated;
export const enemyKilled = enemiesSlice.actions.enemyKilled;
export const enemyAttacked = createAction(
  'enemy/enemyAttacked',
  (enemy: Enemy, damage: number) => ({ payload: { enemy, damage }}),
);

export default enemiesSlice.reducer;
