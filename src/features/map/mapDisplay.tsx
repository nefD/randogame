import React from 'react';

import 'features/map/mapDisplay.scss';
import {
  AREA_CELL_TYPES,
  AreaCellDisplayDefs,
  PlayerCellDisplayDef,
} from 'data/areas.consts';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  getCurrentMapArea,
  getCurrentMapCells,
  getTranslatedPlayerMapPos,
} from 'redux/mapAreas/mapAreas.selectors';
import {
  Box,
  Flex,
} from '@chakra-ui/core';
import { rng } from 'utilities/random.utilities';

export const MapDisplay = () => {
  const dispatch = useDispatch();
  const areaCells = useSelector(getCurrentMapCells);
  const mapArea = useSelector(getCurrentMapArea);
  const translatedPlayerPos = useSelector(getTranslatedPlayerMapPos);

  const renderMapCell = (cellType: AREA_CELL_TYPES, x: number, y: number) => {
    if (!AreaCellDisplayDefs[cellType]) {
      return (<div key={`${x},${y}`} className="mapCell"/>)
    }

    if (translatedPlayerPos.x === x && translatedPlayerPos.y === y) {
      return (
        <div key={`${x},${y}`} className="mapCell">
          <div className={"cellIcon " + PlayerCellDisplayDef.cssClass}>
            {PlayerCellDisplayDef.content}
          </div>
        </div>
      );
    }

    const inlineStyle = { animationDelay: '0s' };
    if (cellType === AREA_CELL_TYPES.Plains) {
      inlineStyle.animationDelay = `-${rng(2)}s`;
    } else if (cellType === AREA_CELL_TYPES.Forest) {
      inlineStyle.animationDelay = `-${rng(1.5)}s`;
    } else if (cellType === AREA_CELL_TYPES.Water) {
      const delay = (x * 0.2) + (y * 0.4);
      inlineStyle.animationDelay = `-${delay}s`;
    }

    let content = <span style={inlineStyle}>{AreaCellDisplayDefs[cellType].content}</span>;
    const def = AreaCellDisplayDefs[cellType];
    if (def.icon) {
      // content = <def.icon></def.icon>;
      return (
        <div key={`${x},${y}`} className="mapCell">
          <Flex align='center' justify='center' className={"cellIcon " + AreaCellDisplayDefs[cellType].iconClass} style={inlineStyle}>
            <def.icon style={inlineStyle}/>
          </Flex>
        </div>
      );
    }

    return (
      <div key={`${x},${y}`} className="mapCell">
        <Flex align='center' justify='center' className={"cellIcon " + AreaCellDisplayDefs[cellType].cssClass} style={inlineStyle}>
          {content}
        </Flex>
      </div>
    );
  }

  const rows: Array<JSX.Element[]> = [];
  if (mapArea) {
    for (let y = 0; y < areaCells[0].length; y++) {
      let row: JSX.Element[] = [];
      for (let x = 0; x < areaCells.length; x++) {
        row.push(renderMapCell(areaCells[x][y], x, y));
      }
      rows.push(row);
    }
  }

  return (
    <Box className="mapContainer">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="mapRow">
          {row.map(content => content)}
        </div>
      ))}
    </Box>
  );
};
