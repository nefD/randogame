import { CharacterSkill } from 'redux/character/character.slice';
import { SKILL_KEYS } from 'data/skills.consts';

export const CharacterSkillFactory = (config?: Partial<CharacterSkill>): CharacterSkill => ({
  skillKey: SKILL_KEYS.Empty,
  level: 0,
  progress: 0,
  ...config,
});
