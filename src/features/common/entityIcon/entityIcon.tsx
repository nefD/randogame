import React from 'react';
import { ItemDefs } from 'data/item.consts';
import './entityIcon.scss';
import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { ResourceNodeIcons } from 'data/resources.consts';
import { FacilityIcons } from 'data/areas.consts';
import { Facility } from 'models/map';
import { Item } from 'models/item';
import { Icon } from "components/icon/icon";

type EntityIconProps = {
  item?: Item;
  resourceNode?: ResourceNode;
  facility?: Facility;
}

export function EntityIcon({ item, resourceNode, facility}: EntityIconProps) {
  let icon;
  if (item) {
    icon = ItemDefs[item.key].icon;
  } else if (resourceNode) {
    icon = ResourceNodeIcons[resourceNode.type];
  } else if (facility) {
    icon = FacilityIcons[facility.type];
  }
  // return icon ? <Icon icon={icon} /> : null;
  return <Icon icon={icon} />
}
