export interface Coords {
  x: number;
  y: number;
}
export const coordsFactory = (x = 0, y = 0): Coords => ({ x, y });

