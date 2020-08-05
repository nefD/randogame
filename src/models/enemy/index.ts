import { MapLocation, MapLocationFactory, } from 'models/map';
import { LootTableKey } from 'data/loot.consts';
import { uuid } from 'utilities/random.utilities';
import { ENEMY_KEY } from "data/enemies.consts";

export interface Enemy {
  id: string;
  name: string;
  key: ENEMY_KEY;
  location: MapLocation;
  health: number;
  maxHealth: number;
  lootTables: LootTableKey[];
}

export const EnemyFactory = (config?: Partial<Enemy>): Enemy => ({
  id: uuid(),
  name: 'Unknown Enemy',
  location: MapLocationFactory(),
  health: 1,
  maxHealth: 1,
  lootTables: [],
  key: ENEMY_KEY.Test,
  ...config,
});
