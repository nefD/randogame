import { Item } from '../redux/items/items.slice';
import { uuid } from './random.utilities';

export const ItemFactory = (config?: Partial<Item>): Item => ({
  id: uuid(),
  name: 'Unknown Item',
  ...config,
});
