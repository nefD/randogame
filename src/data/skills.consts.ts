import {Skill} from "models/character/skill";

export enum SKILL_KEY {
  Empty = 'Empty',
  Daggers = 'Daggers',
  Woodcutting = 'Woodcutting',
}

export type SkillKey = keyof typeof SKILL_KEY;

export const SkillDefs: { [key in SKILL_KEY]: Skill } = {
  [SKILL_KEY.Empty]: {
    key: SKILL_KEY.Empty,
    name: 'Empty Skill',
  },
  [SKILL_KEY.Daggers]: {
    key: SKILL_KEY.Daggers,
    name: 'Daggers & Knives',
  },
  [SKILL_KEY.Woodcutting]: {
    key: SKILL_KEY.Woodcutting,
    name: 'Woodcutting',
  }
};
