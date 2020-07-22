import React from 'react';

export enum SKILL_KEYS {
  Empty = 'Empty',
  Woodcutting = 'Woodcutting'
}

export type SkillKey = keyof typeof SKILL_KEYS;

export interface SkillDefinition {
  key: SkillKey;
  name: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
  description?: string;
}

export const SkillDefs: { [key in SKILL_KEYS]: SkillDefinition } = {
  [SKILL_KEYS.Empty]: {
    key: SKILL_KEYS.Empty,
    name: 'Empty',
  },
  [SKILL_KEYS.Woodcutting]: {
    key: SKILL_KEYS.Woodcutting,
    name: 'Woodcutting',
  }
};
