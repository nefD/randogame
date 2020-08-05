import { CHARACTER_RACE } from "data/races.consts";
import { Facility } from "models/map/facility";

export interface Town {
  race: CHARACTER_RACE;
  facilities: Facility[];
}

export const TownFactory = (config?: Partial<Town>): Town => ({
  race: CHARACTER_RACE.Human,
  facilities: [],
  ...config,
});
