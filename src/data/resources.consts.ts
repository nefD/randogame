import {
  ITEM_KEYS,
  ItemKey,
} from 'data/item.consts';

export enum AREA_RESOURCE_TYPE {
  Plant,
  Tree,
  Stone,
  Mine,
  Stick,
  Sand,
}

export interface ResourceNodeDef {
  name: string;
  type: AREA_RESOURCE_TYPE;
  yieldsItem: ItemKey;
  remainingResources: number;
}
export const ResourceNodeDefs: { [key: string]: ResourceNodeDef} = {
  Tree: {
    name: 'Tree!',
    type: AREA_RESOURCE_TYPE.Tree,
    yieldsItem: ITEM_KEYS.Wood,
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: Record<string, string> = {
  Tree: 'pine-tree.svg',
};
