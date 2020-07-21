import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { MapLocation } from 'data/commonTypes';
import { LootTableKey } from 'data/loot.consts';

export interface Enemy {
  id: string;
  name: string;
  location: MapLocation;
  health: number;
  maxHealth: number;
  lootTables: LootTableKey[];
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
