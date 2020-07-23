import { NODE_KEYS } from 'data/resources.consts';
import {
  ITEM_KEYS,
  ItemKey,
} from 'data/item.consts';
import React from 'react';
import {
  IconForest,
  IconMountain,
  IconPlains,
  IconTown,
} from 'data/icons.consts';

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
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}

export const PlayerCellDisplayDef: CellDisplayDefinition = {
  content: '😠',
  cssClass: 'cellPlayer',
  name: 'Player',
};

export const AreaCellDisplayDefs: Record<AREA_CELL_TYPES, CellDisplayDefinition> = {
  [AREA_CELL_TYPES.None]: {
    content: '~',
    cssClass: 'cellEmpty',
    name: 'Water',
  },
  [AREA_CELL_TYPES.Plains]: {
    content: 'P',
    cssClass: 'cellPlains',
    name: 'Plains',
    icon: IconPlains,
    iconClass: 'icon-plains'
  },
  [AREA_CELL_TYPES.Forest]: {
    content: 'T',
    cssClass: 'cellForest',
    name: 'Forest',
    icon: IconForest,
    iconClass: 'icon-forest',
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
    icon: IconMountain,
    iconClass: 'icon-mountain',
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
    icon: IconTown,
    iconClass: 'icon-town',
  },
};

export enum AreaResourceType {
  Item,
  Node,
}

export interface CellResourceDefinition {
  type: AreaResourceType;
  itemKey?: ItemKey;
  nodeKey?: string;
  max: number;
  chance: number;
}

export const AreaCellResourceDefs: Record<AREA_CELL_TYPES, CellResourceDefinition[]> = {
  [AREA_CELL_TYPES.None]: [],
  [AREA_CELL_TYPES.Town]: [],
  [AREA_CELL_TYPES.Water]: [],
  [AREA_CELL_TYPES.Beach]: [
    {
      type: AreaResourceType.Item,
      itemKey: ITEM_KEYS.Sand,
      max: 1,
      chance: 50,
    },
  ],
  [AREA_CELL_TYPES.Plains]: [
    {
      type: AreaResourceType.Item,
      itemKey: ITEM_KEYS.Stick,
      max: 1,
      chance: 20,
    },    {
      type: AreaResourceType.Item,
      itemKey: ITEM_KEYS.Plant,
      max: 1,
      chance: 50,
    },
  ],
  [AREA_CELL_TYPES.Forest]: [
    {
      type: AreaResourceType.Node,
      nodeKey: 'Tree', // this should be a strongly typed value
      max: 1,
      chance: 100,
    },
    {
      type: AreaResourceType.Item,
      itemKey: ITEM_KEYS.Stick,
      max: 1,
      chance: 50,
    },
    {
      type: AreaResourceType.Item,
      itemKey: ITEM_KEYS.Plant,
      max: 1,
      chance: 20,
    },
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

export const FacilityIcons: { [key: string]: string } = {
  [FACILITY_TYPE.Inn]: 'bed.svg',
  [FACILITY_TYPE.Tavern]: 'beer-stein.svg',
  [FACILITY_TYPE.Shop]: 'shop.svg',
};
