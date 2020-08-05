import { ENEMY_KEY } from "data/enemies.consts";

export enum SPAWN_KEYS {
  Test = 'Test',
}

export interface SpawnDefinition {
  chance: number;
  enemyKey: ENEMY_KEY;
  minLevel: number;
  maxLevel?: number;
}

export const SpawnDefs: { [key in SPAWN_KEYS]: SpawnDefinition } = {
  Test: {
    chance: 50,
    enemyKey: ENEMY_KEY.Test,
    minLevel: 1,
  },
}

export const getSpawnDefinition = (key: SPAWN_KEYS) => SpawnDefs[key];
