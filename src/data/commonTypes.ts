export interface Coords {
  x: number;
  y: number;
}
export const coordsFactory = (x = 0, y = 0): Coords => ({ x, y });

export interface Stats {
  health: number;
  healthMax: number;
  mana: number;
  manaMax: number;
  hunger: number;
  hungerMax: number;
  attack: number;
  defense: number;
}
export const StatsFactory = (config?: Partial<Stats>): Stats => ({
  health: 1,
  healthMax: 1,
  mana: 1,
  manaMax: 1,
  hunger: 1,
  hungerMax: 1,
  attack: 0,
  defense: 0,
  ...config,
});
