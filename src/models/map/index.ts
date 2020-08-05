import { AREA_CELL_TYPES, } from 'data/areas.consts';
import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { uuid } from 'utilities/random.utilities';
import { Coords } from 'data/commonTypes';
import { Item } from "models/item";
import { Town } from "models/map/town";
import { SpawnDefinition } from "data/spawns.consts";
import { Enemy } from "models/enemy";

export interface MapArea {
  id: string;
  name: string;
  width: number;
  height: number;
  cellTypes: AREA_CELL_TYPES[];
  items: { [key: string]: Item[] };
  enemies: { [key: string]: Enemy[] };
  towns: { [key: string]: Town };
  resourceNodes: { [key: string]: ResourceNode[] };
  spawns: { [key: string]: SpawnDefinition[] };
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
  spawns: {},
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
