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
  // iconPath?: string;
  // usesTool, usesSkill
  remainingResources: number;
}
export const ResourceNodeDefs: { [key: string]: ResourceNodeDef} = {
  Tree: {
    name: 'Tree!',
    // iconPath: 'pine-tree.svg',
    remainingResources: 6,
  },
};

export const ResourceNodeIcons: Record<string, string> = {
  Tree: 'pine-tree.svg',
};
