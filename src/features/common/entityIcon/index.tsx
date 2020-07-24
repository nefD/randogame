import React from 'react';
import { ItemDefs } from 'data/item.consts';
import './entityIcon.scss';
import {
  ResourceNode,
} from 'redux/mapAreas/mapAreas.slice';
import {ResourceNodeDefs, ResourceNodeIcons} from 'data/resources.consts';
import { FacilityIcons } from 'data/areas.consts';
import { Facility } from 'models/map';
import { Item } from 'models/item';
import { Box } from '@chakra-ui/core';
import {Icon} from "components/icon/icon";

type EntityIconProps = {
  item?: Item;
  resourceNode?: ResourceNode;
  facility?: Facility;
}

export function EntityIcon({ item, resourceNode, facility}: EntityIconProps) {
  if (item) {
    const icon = ItemDefs[item.key].icon;
    if (!icon) return (<Box className="entityIcon"></Box>);
    return <Icon icon={icon} />
  }

  if (resourceNode) {
    const icon = ResourceNodeIcons[resourceNode.type];
    if (!icon) return (<Box className="entityIcon"></Box>)
    return <Icon icon={icon} />
  }

  if (facility) {
    const icon = FacilityIcons[facility.type];
    if (!icon) return (<Box className="entityIcon"></Box>);
    return <Icon icon={icon} />
  }

  return (<Box className="entityIcon"></Box>);
}
