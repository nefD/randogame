import { Enemy } from 'redux/enemies/enemies.slice';

export interface EnemyDefinition {
  config: Partial<Enemy>;
}

export const EnemyDefs: { [key: string]: EnemyDefinition } = {
  TestEnemy: {
    config: {
      name: 'Test Enemy',
      health: 10,
      maxHealth: 10,
      lootTables: ['testing'],
    },
  }
};
