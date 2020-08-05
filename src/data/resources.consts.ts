import React from "react";
import {IconForest} from "./icons.consts";
import { ITEM_KEYS, ItemKey } from "data/items.keys";

export enum NODE_KEYS {
  Tree = 'Tree',
}

export interface ResourceNodeDef {
  name: string;
  type: NODE_KEYS;
  requiresTool?: ItemKey;
  yieldsItem: ItemKey;
  yieldBaseChance?: number;
  remainingResources: number;
}
export const ResourceNodeDefs: { [key in NODE_KEYS]: ResourceNodeDef} = {
  [NODE_KEYS.Tree]: {
    name: 'Tree!',
    type: NODE_KEYS.Tree,
    requiresTool: ITEM_KEYS.WoodAxe,
    yieldsItem: ITEM_KEYS.Wood,
    yieldBaseChance: 30,
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: { [key in NODE_KEYS]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  Tree: IconForest
};
