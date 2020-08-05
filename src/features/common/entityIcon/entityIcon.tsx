import React from 'react';
import { ItemDefs } from 'data/items.consts';
import './entityIcon.scss';
import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { ResourceNodeIcons } from 'data/resources.consts';
import { Item } from 'models/item';
import { Icon } from "components/icon/icon";
import { Skill } from "models/character/skill";
import { Ability } from "models/character/ability";
import { getFacilityDefinition } from "data/facilities.consts";
import { Facility } from "models/map/facility";

type EntityIconProps = {
  item?: Item;
  resourceNode?: ResourceNode;
  facility?: Facility;
  skill?: Skill;
  ability?: Ability;
}

export function EntityIcon({ item, resourceNode, facility, skill, ability}: EntityIconProps) {
  let icon;
  if (item) {
    icon = ItemDefs[item.key].icon;
  } else if (resourceNode) {
    icon = ResourceNodeIcons[resourceNode.type];
  } else if (facility) {
    const facilityDef = getFacilityDefinition(facility.key);
    icon = facilityDef.icon;
  } else if (skill) {
    icon = skill.icon;
  } else if (ability) {
    icon = ability.icon;
  }
  return <Icon icon={icon} />
}
