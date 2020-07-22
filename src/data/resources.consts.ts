import {
  ITEM_KEYS,
  ItemKey,
} from 'data/item.consts';

export enum AREA_RESOURCE_TYPE {
  Plant = 'Plant',
  Tree = 'Tree',
  Stone = 'Stone',
  Mine = 'Mine',
  Stick = 'Stick',
  Sand = 'Sand',
}

export interface ResourceNodeDef {
  name: string;
  type: AREA_RESOURCE_TYPE;
  yieldsItem: ItemKey;
  remainingResources: number;
}
export const ResourceNodeDefs: { [key: string]: ResourceNodeDef} = {
  [AREA_RESOURCE_TYPE.Tree]: {
    name: 'Tree!',
    type: AREA_RESOURCE_TYPE.Tree,
    yieldsItem: ITEM_KEYS.Wood,
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: Record<string, string> = {
  Tree: 'pine-tree.svg',
};
