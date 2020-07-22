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
  // iconPath?: string;
  // usesTool, usesSkill
  remainingResources: number;
}
export const ResourceNodeDefs: { [key: string]: ResourceNodeDef} = {
  Tree: {
    name: 'Tree!',
    type: AREA_RESOURCE_TYPE.Tree,
    // iconPath: 'pine-tree.svg',
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: Record<string, string> = {
  Tree: 'pine-tree.svg',
};
