import { Ability, ABILITY_TARGET } from "models/character/ability";
import { SKILL_KEY } from "data/skills.consts";
import { IconFlyingDagger } from "data/icons.consts";

export enum ABILITY_KEY {
  Empty = 'Empty',
  Puncture = 'Puncture',
}

export type AbilityKey = keyof typeof ABILITY_KEY;

export const AbilityDefs: { [key in ABILITY_KEY]: Ability } = {
  [ABILITY_KEY.Empty]: {
    key: ABILITY_KEY.Empty,
    name: 'Empty Ability',
    skillKey: SKILL_KEY.Empty,
    isSpell: false,
    usableInCombat: true,
    usableOutsideCombat: true,
    weaponRequired: false,
    manaCost: 0,
    target: ABILITY_TARGET.self,
  },
  [ABILITY_KEY.Puncture]: {
    key: ABILITY_KEY.Puncture,
    name: 'Pierce',
    skillKey: SKILL_KEY.Daggers,
    icon: IconFlyingDagger,
    isSpell: false,
    usableInCombat: true,
    usableOutsideCombat: false,
    weaponRequired: true,
    manaCost: 10,
    target: ABILITY_TARGET.enemy,
    damageProps: {
      baseDamage: 1,
      // skillMultiDamage: 2,
      weaponMultiDamage: 1.5,
    },
  },
};
