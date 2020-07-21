import {
  rng,
  shuffleArray,
  uuid,
} from 'utilities/random.utilities';
import {
  MapArea,
  Town,
} from 'redux/mapAreas/mapAreas.slice';
import {
  AREA_CELL_TYPES,
  FACILITY_TYPE,
} from 'data/areas.consts';
import {
  FacilityFactory,
  fromXY,
  MapAreaFactory,
  TownFactory,
} from 'utilities/mapAreas.utilities';
import { Coords } from 'data/commonTypes';


const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];

const getNeighbor = (grid: Array<AREA_CELL_TYPES[]>, x: number, y: number, dX: number, dY: number): AREA_CELL_TYPES => {
  x += dX;
  y += dY;
  if (x < 0 || y < 0 || x > grid.length - 1 || y > grid[0].length - 1) return AREA_CELL_TYPES.None;
  return grid[x][y];
};

const getNeighborsOfType = (grid: Array<AREA_CELL_TYPES[]>, x: number, y: number, type: AREA_CELL_TYPES): number => {
  let count = 0;
  directions.forEach(dir => count += +(getNeighbor(grid, x, y, dir[0], dir[1]) === type));
  return count;
};

const getLandNeighbors = (grid: Array<AREA_CELL_TYPES[]>, x: number, y: number): number => {
  let count = 0;
  let type;
  directions.forEach(dir => {
    type = getNeighbor(grid, x, y, dir[0], dir[1]);
    if (type !== AREA_CELL_TYPES.None && type !== AREA_CELL_TYPES.Water) count++;
  });
  return count;
};

const applySmoothing = (grid: Array<AREA_CELL_TYPES[]>): Array<AREA_CELL_TYPES[]> => {
  const newGrid: Array<AREA_CELL_TYPES[]> = [];
  const width = grid.length;
  const height = grid[0].length;
  let neighbors;
  for (let x = 0; x < width; x++) {
    newGrid[x] = [];
    for (let y = 0; y < height; y++) {
      neighbors = getLandNeighbors(grid, x, y);
      if (neighbors > 3) newGrid[x][y] = AREA_CELL_TYPES.Beach;
      else if (neighbors > 1) newGrid[x][y] = grid[x][y];
      else newGrid[x][y] = AREA_CELL_TYPES.Water;
    }
  }
  return newGrid;
};

const terraform = (grid: Array<AREA_CELL_TYPES[]>, x: number, y: number): AREA_CELL_TYPES => {
  if (grid[x][y] === AREA_CELL_TYPES.None || grid[x][y] === AREA_CELL_TYPES.Water) return grid[x][y];
  const beaches = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Beach);
  const forests = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Forest);
  const plains = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Plains);
  const water = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Water);
  const mountains = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Mountain);
  const empty = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.None);
  const nonLand = water + empty;

  // thin mountain ranges
  if (grid[x][y] === AREA_CELL_TYPES.Mountain && mountains > 4) {
    if (rng(100) < 20) {
      return AREA_CELL_TYPES.Forest;
    } else {
      return AREA_CELL_TYPES.Plains;
    }
  }

  // expand mountain ranges
  if (mountains > 1 && mountains < 3) {
    const mountainChance = 20;
    if (rng(100) < mountainChance) return AREA_CELL_TYPES.Mountain;
  }

  // build new mountains, thin out forests
  if (grid[x][y] === AREA_CELL_TYPES.Forest) {
    if (forests > 4 && mountains < 3) {
      const mountainChance = 50;
      if (rng(100) < mountainChance) return AREA_CELL_TYPES.Mountain;
    }
    if (forests > 6) return 2;
    if (forests > 3 && rng(100) < 50) return AREA_CELL_TYPES.Plains;
  }

  // build new forests
  if (grid[x][y] === AREA_CELL_TYPES.Plains) {
    if (forests > 3 && forests < 7) return AREA_CELL_TYPES.Forest;
    const growChance = 40;
    if (plains > 2 && nonLand < 2 && rng(100) < growChance) return AREA_CELL_TYPES.Forest;
  }

  // build inland plains
  if (beaches > 5) return AREA_CELL_TYPES.Plains;

  return grid[x][y];
};
const applyTerraforming = (grid: Array<AREA_CELL_TYPES[]>): Array<AREA_CELL_TYPES[]> => {
  const newGrid: Array<AREA_CELL_TYPES[]> = [];
  for (let x = 0; x < grid.length; x++) {
    newGrid[x] = [];
    for (let y = 0; y < grid[0].length; y++) {
      newGrid[x][y] = terraform(grid, x, y);
    }
  }
  return newGrid;
};

const getEligibleTownLocations = (grid: Array<AREA_CELL_TYPES[]>): Coords[] => {
  const eligible: Coords[] = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === AREA_CELL_TYPES.None || grid[x][y] === AREA_CELL_TYPES.Water || grid[x][y] === AREA_CELL_TYPES.Town) continue;
      const land = getLandNeighbors(grid, x, y);
      const towns = getNeighborsOfType(grid, x, y, AREA_CELL_TYPES.Town);
      if (towns <= 0 && land >= 6) eligible.push({ x, y });
    }
  }
  return eligible;
};

const getLandCoverage = (grid: Array<AREA_CELL_TYPES[]>): number => {
  let count = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] !== AREA_CELL_TYPES.None && grid[x][y] !== AREA_CELL_TYPES.Water) count++;
    }
  }
  return count;
};

const initGrid = (width: number, height: number): Array<AREA_CELL_TYPES[]> => {
  const grid: Array<AREA_CELL_TYPES[]> = [];
  for (let x = 0; x < width; x++) {
    grid[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = AREA_CELL_TYPES.Water;
    }
  }
  return grid;
};

const seedGrid = (grid: Array<AREA_CELL_TYPES[]>) => {
  const width = grid.length;
  const height = grid[0].length;
  const middleX = width / 2;
  const middleY = height / 2;
  const baseChance = 20;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const distance = Math.min(
        Math.min(x, width - x - 1) / middleX,
        Math.min(y, height - y - 1) / middleY
      );
      const chance = baseChance + (distance * 100);
      if (rng(100) <= chance) grid[x][y] = AREA_CELL_TYPES.Beach;
    }
  }
};

export const generateMapArea = (
  width: number = 10,
  height: number = 10,
  id: string = uuid()
): MapArea => {
  let grid: Array<AREA_CELL_TYPES[]> = [];

  let tries = 0;
  let maxTries = 5;
  while (tries < maxTries) {
    grid = initGrid(width, height);
    seedGrid(grid);
    grid = applySmoothing(grid);
    grid = applySmoothing(grid);

    for (let i = 0; i < 7; i++)
      grid = applyTerraforming(grid);

    if (getLandCoverage(grid) >= 60) break;
    tries++;
  }
  if (tries >= maxTries) {
    console.log('too many tries!');
  }

  const towns: { [key: string]: Town } = {};
  for (let i = 0; i < 3; i++) {
    let townSites = shuffleArray(getEligibleTownLocations(grid));
    if (!townSites.length) break;
    const site = townSites.pop();
    grid[site.x][site.y] = AREA_CELL_TYPES.Town;
    const town = TownFactory();
    town.facilities.push(FacilityFactory({ name: 'Inn', type: FACILITY_TYPE.Inn }));
    town.facilities.push(FacilityFactory({ name: 'Tavern', type: FACILITY_TYPE.Tavern }));
    town.facilities.push(FacilityFactory({ name: 'General Store', type: FACILITY_TYPE.Shop }));
    towns[fromXY(site!.x, site!.y, width)] = town;
  }

  const cellTypes: AREA_CELL_TYPES[] = [];
  grid.forEach((column, x) => column.forEach((cell, y) => {
    cellTypes[fromXY(x,y,width)] = cell;
  }));

  return MapAreaFactory({
    id,
    name: 'Generated Map Area',
    width,
    height,
    cellTypes,
    towns,
  });
}
