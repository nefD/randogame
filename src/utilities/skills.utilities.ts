import { CharacterSkill } from 'redux/character/character.slice';
import { SKILL_KEYS } from 'data/skills.consts';

export const CharacterSkillFactory = (config?: Partial<CharacterSkill>): CharacterSkill => ({
  skillKey: SKILL_KEYS.Empty,
  level: 0,
  points: 0,
  pointsToLevel: 10,
  ...config,
});
