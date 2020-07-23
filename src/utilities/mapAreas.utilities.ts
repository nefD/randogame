import {
  AREA_CELL_TYPES,
  FACILITY_TYPE,
} from 'data/areas.consts';
import {
  rng,
  shuffleArray,
  uuid,
} from './random.utilities';
import { Coords } from 'data/commonTypes';
import {
  Facility,
  FacilityFactory,
  MapArea,
  MapAreaFactory,
  Town,
  TownFactory,
} from 'models/map';

export function fromXY(x: number, y: number, width: number | MapArea = 0): number {
  if (typeof width !== 'number') {
    width = width.width;
  }
  return (y * width) + x;
}

export function toXY(n: number, width: number | MapArea): {x: number, y: number} {
  if (typeof width !== 'number') {
    width = width.width;
  }
  return { x: n % width, y: Math.floor(n / width) };
}

const directions = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1], [-1,0], [-1, -1]];
const inDir = (map: Array<AREA_CELL_TYPES[]>, cellX: number, cellY: number, dirX: number, dirY: number, width: number, height: number): AREA_CELL_TYPES | null => {
  if (cellX + dirX < 0 || cellX + dirX >= width || cellY + dirY < 0 || cellY + dirY >= height) {
    return null;
  }
  return map[cellX + dirX][cellY + dirY];
}

export const isLand = (type: AREA_CELL_TYPES) => (type !== AREA_CELL_TYPES.None && type !== AREA_CELL_TYPES.Water);

export const getEligibleTownLocations = (map: Array<AREA_CELL_TYPES[]>): Coords[] => {
  const eligibleList: Coords[] = [];
  let landCells = 0;
  let foundTown = false;
  let dirCellType: AREA_CELL_TYPES | null = null;
  map.forEach((column, columnIndex) => column.forEach((cellType, rowIndex) => {
    if (!isLand(cellType)) return;
    landCells = 0;
    foundTown = false;
    directions.forEach(dir => {
      dirCellType = inDir(map, columnIndex, rowIndex, dir[0], dir[1], map.length, column.length);
      if (!dirCellType) return;
      if (isLand(dirCellType)) landCells++;
      if (dirCellType === AREA_CELL_TYPES.Town) foundTown = true;
    });
    if (!foundTown && landCells >= 8) eligibleList.push({ x: columnIndex, y: rowIndex });
  }));
  return eligibleList;
};

export const generateMapArea = (
  width: number = 10,
  height: number = 10,
  id: string = uuid()
): MapArea => {
  let cellsMap: Array<AREA_CELL_TYPES[]> = [];
  const middleX = width / 2;
  const middleY = height / 2;

  const seedLandChance = 15;
  const distanceStrength = 85;
  for (let x = 0; x < width; x++) {
    cellsMap[x] = [];
    for (let y = 0; y < height; y++) {
      let type = AREA_CELL_TYPES.Water;
      // between 0 and 1, according to distance to the center of the map
      const distanceModifier = (((Math.min(x, width - x - 1)) / middleX) + ((Math.min(y, height - y - 1)) / middleY)) / 2;
      // possibly place land, chance is according to distance from center plus a base amount
      let chance = (seedLandChance + (distanceModifier * distanceStrength) );
      if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
        chance = 0;
      } else if (x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2) {
        chance *= 0.25;
      } else if (x <= 2 || x >= width - 3 || y <= 2 || y >= height - 3) {
        chance *= 0.5;
      }
      if (rng(100) <= chance) type = AREA_CELL_TYPES.Beach;

      cellsMap[x][y] = type;
    }
  }

  const process = (cm: Array<AREA_CELL_TYPES[]>) => {
    let newMap: Array<AREA_CELL_TYPES[]> = [];

    cm.forEach((column, colIdx) => {
      newMap[colIdx] = [];
      column.forEach((cell, rowIdx) => {
        newMap[colIdx][rowIdx] = cell;
      });
    });

    cm.forEach((column, colIdx) => {
      newMap[colIdx] = [];
      return column.forEach((cell, rowIdx) => {
        let newCell = cell;
        let surrounding = 0;
        let swampCount = 0;
        let swampCountCardinal = 0;
        let plainsCount = 0;
        let forestCount = 0;
        let mountainCount = 0;
        let beachCount = 0;
        let waterCount = 0;

        directions.forEach(dir => {
          const dirCell = inDir(newMap, colIdx, rowIdx, dir[0], dir[1], width, height);
          const oldDirCell = inDir(cm, colIdx, rowIdx, dir[0], dir[1], width, height) || dirCell;
          const isCardinal = Math.abs(dir[0]) + Math.abs(dir[1]) === 1;

          if (dirCell && oldDirCell) {
            if (dirCell !== AREA_CELL_TYPES.Water || oldDirCell !== AREA_CELL_TYPES.Water) surrounding += 1;
            if (dirCell === AREA_CELL_TYPES.Water || oldDirCell === AREA_CELL_TYPES.Water) waterCount += 1;
            if (dirCell === AREA_CELL_TYPES.Swamp || oldDirCell === AREA_CELL_TYPES.Swamp) swampCount += 1;
            if ((dirCell === AREA_CELL_TYPES.Swamp || oldDirCell === AREA_CELL_TYPES.Swamp) && isCardinal) swampCountCardinal += 1;
            if (dirCell === AREA_CELL_TYPES.Plains) plainsCount += 1;
            if (dirCell === AREA_CELL_TYPES.Forest) forestCount += 1;
            if (dirCell === AREA_CELL_TYPES.Mountain) mountainCount += 1;
            if (dirCell === AREA_CELL_TYPES.Beach || oldDirCell === AREA_CELL_TYPES.Beach) beachCount += 1;
          }
        });

        if (surrounding >= 5) {
          newCell = AREA_CELL_TYPES.Beach;

          if (waterCount > 0) {
            newCell = AREA_CELL_TYPES.Beach;
          } else if (forestCount >= 1 && mountainCount === 0 && Math.random() > 0.85) {
            newCell = AREA_CELL_TYPES.Swamp;
          } else if (swampCountCardinal > 0 && swampCount < 4 && swampCountCardinal >= swampCount && Math.random() > 0.6) {
            newCell = AREA_CELL_TYPES.Swamp;
          } else if (mountainCount >= 1 && mountainCount < 3 && Math.random() > 0.7) {
            newCell = AREA_CELL_TYPES.Mountain;
          } else if (mountainCount < 2 && ((forestCount >= 1 && plainsCount >= 1) || forestCount >= 2) && Math.random() > 0.7) {
            newCell = AREA_CELL_TYPES.Mountain;
          } else if (forestCount >= 8) {
            newCell = AREA_CELL_TYPES.Forest;
          } else if (forestCount >= 5 && Math.random() > 0.4) {
            newCell = AREA_CELL_TYPES.Forest;
          } else if (surrounding >= 5 && forestCount >= 2 && Math.random() > 0.5) {
            newCell = AREA_CELL_TYPES.Forest;
          } else if (plainsCount >= 3 && Math.random() > 0.6) {
            newCell = AREA_CELL_TYPES.Forest;
          } else if (surrounding >= 7) {
            newCell = AREA_CELL_TYPES.Plains;
          }
        }
        newMap[colIdx][rowIdx] = newCell;
      })
    });
    return newMap;
  };

  cellsMap = process(cellsMap);
  cellsMap = process(cellsMap);
  cellsMap = process(cellsMap);
  cellsMap = process(cellsMap);

  const towns: { [key: string]: Town } = {};
  for (let i = 0; i < 5; i++) {
    let townSites = shuffleArray(getEligibleTownLocations(cellsMap));
    if (!townSites.length) break;
    const site = townSites.pop();
    cellsMap[site!.x][site!.y] = AREA_CELL_TYPES.Town;

    const town = TownFactory();
    town.facilities.push(FacilityFactory({ name: 'Inn', type: FACILITY_TYPE.Inn }));
    town.facilities.push(FacilityFactory({ name: 'Tavern', type: FACILITY_TYPE.Tavern }));
    town.facilities.push(FacilityFactory({ name: 'General Store', type: FACILITY_TYPE.Shop }));
    towns[fromXY(site!.x, site!.y, width)] = town;
  }

  const cellTypes: AREA_CELL_TYPES[] = [];
  cellsMap.forEach((column, x) => column.forEach((cell, y) => {
    cellTypes[fromXY(x, y, width)] = cell;
  }));

  // cellTypes[fromXY(10, 11, width)] = AREA_CELL_TYPES.Town;

  return MapAreaFactory({
    id,
    name: 'Generated Map Area',
    width,
    height,
    cellTypes,
    towns,
  });
};

export const findFacilityInMapArea = (mapArea: MapArea, facilityId: string) =>
  Object.values(mapArea.towns)
    .reduce((list: Facility[], town: Town) => list.concat(town.facilities), [])
    .find(facility => facility.id === facilityId);
