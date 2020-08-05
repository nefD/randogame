import { Enemy } from 'models/enemy';

export enum ENEMY_KEY {
  Test = 'Test',
}

// export type EnemyKey = keyof typeof ENEMY_KEY;

export interface EnemyDefinition {
  config: Partial<Enemy>;
}

export const EnemyDefs: { [key in ENEMY_KEY]: EnemyDefinition } = {
  [ENEMY_KEY.Test]: {
    config: {
      name: 'Test Enemy',
      key: ENEMY_KEY.Test,
      health: 10,
      maxHealth: 10,
      lootTables: ['testing'],
    },
  }
};

export const getEnemyDefinition = (key: ENEMY_KEY) => EnemyDefs[key];
