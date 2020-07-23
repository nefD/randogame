export enum STATS {
  health = 'health',
  healthMax = 'healthMax',
  mana = 'mana',
  manaMax = 'manaMax',
  hunger = 'hunger',
  hungerMax = 'hungerMax',
  attack = 'attack',
  defense = 'defense',
  strength = 'strength',
  dexterity = 'dexterity',
  intelligence = 'intelligence',
}

export type StatsKey = keyof typeof STATS;

export type Stats = {
  [key in STATS]: number;
}

export const StatsFactory = (config?: Partial<Stats>): Stats => ({
  [STATS.health]: 1,
  [STATS.healthMax]: 1,
  [STATS.mana]: 1,
  [STATS.manaMax]: 1,
  [STATS.hunger]: 1,
  [STATS.hungerMax]: 1,
  [STATS.attack]: 0,
  [STATS.defense]: 0,
  [STATS.strength]: 1,
  [STATS.dexterity]: 1,
  [STATS.intelligence]: 1,
  ...config,
});

