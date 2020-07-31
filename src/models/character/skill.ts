import React from "react";
import {SKILL_KEY, SkillKey} from "data/skills.consts";

export interface Skill {
  key: SkillKey;
  name: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
  description?: string;
}

export interface CharacterSkill {
  skillKey: SkillKey;
  level: number;
  points: number;
  pointsToLevel: number;
}

export const CharacterSkillFactory = (config?: Partial<CharacterSkill>): CharacterSkill => ({
  skillKey: SKILL_KEY.Empty,
  level: 0,
  points: 0,
  pointsToLevel: 10,
  ...config,
});
