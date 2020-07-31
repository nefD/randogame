import { SkillKey } from "data/skills.consts";
import {AbilityKey} from "data/abilities.consts";
import React from "react";

export enum ABILITY_TARGET {
  self,
  enemy,
}

export interface AbilityDamageProperties {
  /** Static amount of guaranteed damage */
  baseDamage?: number;
  /** Added damage based on multiplying against related skill */
  skillMultiDamage?: number;
  /** Added damage based on multiplying against weapon damage */
  weaponMultiDamage?: number;
}

export interface Ability {
  name: string;
  key: AbilityKey;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
  skillKey: SkillKey;
  isSpell: boolean;
  target: ABILITY_TARGET;
  usableInCombat: boolean;
  usableOutsideCombat: boolean;
  weaponRequired: boolean;
  manaCost: number;
  damageProps?: AbilityDamageProperties;
}

export interface CombatAbility {
  key: AbilityKey;
  enabled: boolean;
}
