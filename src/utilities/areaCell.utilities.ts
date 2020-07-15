import { AREA_CELL_TYPES } from '../data/areas.consts';
import { AreaCell } from '../redux/areaCells/areaCells.slice';
import { uuid } from './random.utilities';

let id = 0;

export const AreaCellFactory = (config?: Partial<AreaCell>): AreaCell => {
  return {
    id: `${new Date().getTime() + id++}`,
      x: 0,
    y: 0,
    type: AREA_CELL_TYPES.None,
    items: [],
    enemies: [],
  ...config,
  };
};
