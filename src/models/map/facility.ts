import { uuid } from "utilities/random.utilities";
import { FACILITY_KEYS } from "data/facilities.consts";
import { Item } from "models/item";

export interface Facility {
  id: string;
  name: string;
  key: FACILITY_KEYS;
  shopItems: Item[];
}

export const FacilityFactory = (config?: Partial<Facility>): Facility => ({
  id: uuid(),
  name: 'Unknown Facility',
  key: FACILITY_KEYS.Inn,
  shopItems: [],
  ...config,
});
