import { Enemy } from '../redux/enemies/enemies.slice';
import { uuid } from './random.utilities';
import { MapLocationFactory } from './mapAreas.utilities';

export const EnemyFactory = (config?: Partial<Enemy>): Enemy => ({
  id: uuid(),
  name: 'Unknown Enemy',
  location: MapLocationFactory(),
  health: 1,
  maxHealth: 1,
  ...config,
});
