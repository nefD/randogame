import { Item } from '../redux/items/items.slice';
import { uuid } from './random.utilities';
import { ITEM_KEYS } from 'data/item.consts';

export const ItemFactory = (config?: Partial<Item>): Item => ({
  id: uuid(),
  name: 'Unknown Item',
  goldValue: 1,
  key: ITEM_KEYS.Empty,
  ...config,
});
