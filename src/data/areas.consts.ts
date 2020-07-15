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
}

export const PlayerCellDisplayDef: CellDisplayDefinition = {
  content: '😠',
  cssClass: 'cellPlayer',
  name: 'Player',
};

export const AreaCellDisplayDefs: Record<AREA_CELL_TYPES, CellDisplayDefinition> = {
  [AREA_CELL_TYPES.None]: {
    content: '',
    cssClass: '',
    name: 'None',
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
  },
  [AREA_CELL_TYPES.Water]: {
    content: 'W',
    cssClass: 'cellWater',
    name: 'Water',
  },
  [AREA_CELL_TYPES.Town]: {
    content: '$',
    cssClass: 'cellTown',
    name: 'Town',
  },
};

export enum FACILITY_TYPE {
  Inn,
  Tavern,
  Shop,
  Stash,
}
