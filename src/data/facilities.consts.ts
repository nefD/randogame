import React from 'react';
import { IconInn, IconShop, IconTavern } from "data/icons.consts";
import { Facility } from "models/map/facility";

export enum FACILITY_KEYS {
  Inn = 'Inn',
  Tavern = 'Tavern',
  Shop = 'Shop',
  Stash = 'Stash',
}

export interface FacilityDefinition {
  config?: Partial<Facility>;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconClass?: string;
}

export const FacilityDefs: { [key in FACILITY_KEYS]: FacilityDefinition } = {
  [FACILITY_KEYS.Inn]: {
    icon: IconInn,
    config: {
      name: 'Inn',
      key: FACILITY_KEYS.Inn,
    },
  },
  [FACILITY_KEYS.Tavern]: {
    icon: IconTavern,
    config: {
      name: 'Tavern',
      key: FACILITY_KEYS.Tavern,
    },
  },
  [FACILITY_KEYS.Shop]: {
    icon: IconShop,
    config: {
      name: 'Shop',
      key: FACILITY_KEYS.Shop,
    },
  },
  [FACILITY_KEYS.Stash]: {
    config: {
      name: 'Stash',
      key: FACILITY_KEYS.Stash,
    },
  },
};
export const getFacilityDefinition = (key: FACILITY_KEYS) => FacilityDefs[key];
