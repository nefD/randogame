import React from 'react';
import { ItemDefs } from 'data/item.consts';
import './entityIcon.scss';
import {
  ResourceNode,
} from 'redux/mapAreas/mapAreas.slice';
import { ResourceNodeIcons } from 'data/resources.consts';
import { FacilityIcons } from 'data/areas.consts';
import { Facility } from 'models/map';
import { Item } from 'models/item';
import { Box } from '@chakra-ui/core';

type EntityIconProps = {
  item?: Item;
  resourceNode?: ResourceNode;
  facility?: Facility;
}

export function EntityIcon({ item, resourceNode, facility}: EntityIconProps) {
  if (item) {
    const def = ItemDefs[item.key];
    if (!def.icon) return (<Box className="entityIcon"></Box>);
    return (
      <Box bg='gray.700' className={`entityIcon ${def.iconClass}`}>
        <def.icon />
      </Box>
    );
  }

  if (resourceNode) {
    const path = ResourceNodeIcons[resourceNode.key];
    if (!path) return (<Box className="entityIcon"></Box>)
    return (
      <Box bg='gray.700' className="entityIcon">
        <img src={path} alt={resourceNode.name} />
      </Box>
    );
  }

  if (facility) {
    const path = FacilityIcons[facility.type];
    if (!path) return (<Box className="entityIcon"></Box>);
    return (
      <Box bg='gray.700' className="entityIcon">
        <img src={path} alt={facility.name} />
      </Box>
    );
  }

  return (<Box className="entityIcon"></Box>);
}
