import {
  ITEM_KEYS,
  ItemKey,
} from 'data/item.consts';

export enum NODE_KEYS {
  Tree = 'Tree',
}

export interface ResourceNodeDef {
  name: string;
  type: NODE_KEYS;
  requiresTool?: ItemKey;
  yieldsItem: ItemKey;
  remainingResources: number;
}
export const ResourceNodeDefs: { [key in NODE_KEYS]: ResourceNodeDef} = {
  [NODE_KEYS.Tree]: {
    name: 'Tree!',
    type: NODE_KEYS.Tree,
    requiresTool: ITEM_KEYS.WoodAxe,
    yieldsItem: ITEM_KEYS.Wood,
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: Record<string, string> = {
  Tree: 'pine-tree.svg',
};
