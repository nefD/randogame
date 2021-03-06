import {StatModifier} from 'models/character/stats';

export enum EffectType {
  fixed = 'fixed',
  timed = 'timed',
}

export type EffectTypeKeys = keyof typeof EffectType;

export interface Effect {
  type: EffectType;
  name?: string;
  createdOn?: number;
  duration?: number;
  statModifiers: StatModifier[],
}
