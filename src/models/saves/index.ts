import { CHARACTER_RACE } from "data/races.consts";
import { CHARACTER_CLASSES } from "data/classes.consts";

export interface SavedGame {
  creationDate: number;
  compressedData: string;
  characterInfo: {
    name: string;
    race: string;
    class: string;
    level: number;
  }
}

export const SavedGameFactory = (config?: Partial<SavedGame>): SavedGame => ({
  compressedData: '',
  creationDate: new Date().getTime(),
  ...config,
  characterInfo: {
    name: 'Unknown Character',
    race: CHARACTER_RACE.None,
    class: CHARACTER_CLASSES.None,
    level: 1,
    ...config?.characterInfo,
  },
});
