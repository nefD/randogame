import React from 'react';
import './resourceIcon.scss';
import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { ResourceNodeIcons } from 'data/resources.consts';

type ResourceIconProps = {
  resourceNode: ResourceNode;
}

export function ResourceIcon({ resourceNode }: ResourceIconProps) {
  const path = ResourceNodeIcons[resourceNode.key];
  if (!path) return (<div className="resourceIcon"></div>)
  return (
    <div className="resourceIcon">
      <img src={path} alt={resourceNode.name} />
    </div>
  );
}
