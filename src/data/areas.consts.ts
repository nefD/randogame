import { AREA_RESOURCE_TYPE } from 'data/resources.consts';

export enum AREA_CELL_TYPES {
  None,
  Plains,
  Forest,
  Swamp,
  Beach,
  Mountain,
  Water,
  Town,
}

export interface CellDisplayDefinition {
  content: string;
  cssClass: string;
  name: string;
  iconPath?: string;
}

export const PlayerCellDisplayDef: CellDisplayDefinition = {
  content: '😠',
  cssClass: 'cellPlayer',
  name: 'Player',
};

export const AreaCellDisplayDefs: Record<AREA_CELL_TYPES, CellDisplayDefinition> = {
  [AREA_CELL_TYPES.None]: {
    content: 'W',
    cssClass: 'cellEmpty',
    name: 'Water',
  },
  [AREA_CELL_TYPES.Plains]: {
    content: 'P',
    cssClass: 'cellPlains',
    name: 'Plains',
  },
  [AREA_CELL_TYPES.Forest]: {
    content: 'T',
    cssClass: 'cellForest',
    name: 'Forest',
    // iconPath: 'pine-tree.svg',
  },
  [AREA_CELL_TYPES.Swamp]: {
    content: 'S',
    cssClass: 'cellSwamp',
    name: 'Swamp',
  },
  [AREA_CELL_TYPES.Beach]: {
    content: 'B',
    cssClass: 'cellBeach',
    name: 'Beach',
  },
  [AREA_CELL_TYPES.Mountain]: {
    content: 'M',
    cssClass: 'cellMountain',
    name: 'Mountain',
    // iconPath: 'peaks.svg',
  },
  [AREA_CELL_TYPES.Water]: {
    content: '~',
    cssClass: 'cellWater',
    name: 'Water',
  },
  [AREA_CELL_TYPES.Town]: {
    content: '$',
    cssClass: 'cellTown',
    name: 'Town',
  },
};

export interface CellResourceDefinition {
  type: AREA_RESOURCE_TYPE;
  max: number;
  chance: number;
}

export const AreaCellResourceDefs: Record<AREA_CELL_TYPES, CellResourceDefinition[]> = {
  [AREA_CELL_TYPES.None]: [],
  [AREA_CELL_TYPES.Town]: [],
  [AREA_CELL_TYPES.Water]: [],
  [AREA_CELL_TYPES.Beach]: [
    { type: AREA_RESOURCE_TYPE.Sand, max: 1, chance: 50 },
  ],
  [AREA_CELL_TYPES.Plains]: [
    { type: AREA_RESOURCE_TYPE.Stick, max: 1, chance: 20 },
    { type: AREA_RESOURCE_TYPE.Plant, max: 1, chance: 50 },
  ],
  [AREA_CELL_TYPES.Forest]: [
    { type: AREA_RESOURCE_TYPE.Tree, max: 1, chance: 100 },
    { type: AREA_RESOURCE_TYPE.Stick, max: 1, chance: 50 },
    { type: AREA_RESOURCE_TYPE.Plant, max: 1, chance: 20 },
  ],
  [AREA_CELL_TYPES.Mountain]: [],
  [AREA_CELL_TYPES.Swamp]: [],
};

export enum FACILITY_TYPE {
  Inn,
  Tavern,
  Shop,
  Stash,
}
