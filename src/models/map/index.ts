import { CHARACTER_RACE } from 'data/races.consts';
import {
  AREA_CELL_TYPES,
  FACILITY_TYPE,
} from 'data/areas.consts';
import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { uuid } from 'utilities/random.utilities';
import { Coords } from 'data/commonTypes';
import { Item } from "models/item";

export interface Facility {
  id: string;
  name: string;
  type: FACILITY_TYPE;
  shopItems: Item[];
}

export const FacilityFactory = (config?: Partial<Facility>): Facility => ({
  id: uuid(),
  name: 'Unknown Facility',
  type: FACILITY_TYPE.Inn,
  shopItems: [],
  ...config,
});

export interface Town {
  race: CHARACTER_RACE;
  facilities: Facility[];
}

export const TownFactory = (config?: Partial<Town>): Town => ({
  race: CHARACTER_RACE.Human,
  facilities: [],
  ...config,
});

export interface MapArea {
  id: string;
  name: string;
  width: number;
  height: number;
  cellTypes: AREA_CELL_TYPES[];
  items: { [key: string]: Item[] };
  enemies: { [key: string]: string[] };
  towns: { [key: string]: Town };
  resourceNodes: { [key: string]: ResourceNode[] };
}

export const MapAreaFactory = (config?: Partial<MapArea>): MapArea => ({
  id: uuid(),
  name: 'Unknown Area',
  width: 1,
  height: 1,
  cellTypes: [],
  items: {},
  enemies: {},
  towns: {},
  resourceNodes: {},
  ...config,
});


export interface MapLocation {
  mapId: string;
  coords: Coords;
  facilityId: string | null;
}

export const MapLocationFactory = (mapId = '', x = 0, y = 0, facilityId: string | null = null): MapLocation => ({
  mapId,
  coords: { x, y },
  facilityId,
});
