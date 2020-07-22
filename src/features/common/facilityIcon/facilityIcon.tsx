import React from 'react';
import './facilityIcon.scss';
import { Facility } from 'redux/mapAreas/mapAreas.slice';
import { FacilityIcons } from 'data/areas.consts';

type FacilityIconProps = {
  facility: Facility;
}

export function FacilityIcon({ facility }: FacilityIconProps) {
  const path = FacilityIcons[facility.type];
  if (!path) return (<div className="facilityIcon"></div>);
  return (
    <div className="facilityIcon">
      <img src={path} alt={facility.name} />
    </div>
  );
}
