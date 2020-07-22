import React from 'react';
import { Item } from 'redux/items/items.slice';
import { ItemDefs } from 'data/item.consts';
import './entityIcon.scss';
import {
  Facility,
  ResourceNode,
} from 'redux/mapAreas/mapAreas.slice';
import { ResourceNodeIcons } from 'data/resources.consts';
import { FacilityIcons } from 'data/areas.consts';

type EntityIconProps = {
  item?: Item;
  resourceNode?: ResourceNode;
  facility?: Facility;
}

export function EntityIcon({ item, resourceNode, facility}: EntityIconProps) {
  if (item) {
    const def = ItemDefs[item.key];
    if (!def.icon) return (<div className="entityIcon"></div>);
    return (
      <div className={`entityIcon ${def.iconClass}`}>
        <def.icon />
      </div>
    );
  }

  if (resourceNode) {
    const path = ResourceNodeIcons[resourceNode.key];
    if (!path) return (<div className="entityIcon"></div>)
    return (
      <div className="entityIcon">
        <img src={path} alt={resourceNode.name} />
      </div>
    );
  }

  if (facility) {
    const path = FacilityIcons[facility.type];
    if (!path) return (<div className="entityIcon"></div>);
    return (
      <div className="entityIcon">
        <img src={path} alt={facility.name} />
      </div>
    );
  }

  return (<div className="entityIcon"></div>);
}
