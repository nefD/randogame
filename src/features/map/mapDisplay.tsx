import React, { useRef } from 'react';

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
  playerMovingEast,
  playerMovingNorth,
  playerMovingSouth,
  playerMovingWest,
} from 'redux/character/character.slice';
import {
  getCurrentMapArea,
  getCurrentMapCells,
  getTranslatedPlayerMapPos,
} from 'redux/mapAreas/mapAreas.selectors';
import {
  Box,
  Button,
  Stack,
} from '@chakra-ui/core';
import { rng } from 'utilities/random.utilities';

export const MapDisplay = () => {
  const mapArea = useSelector(getCurrentMapArea);

  const dispatch = useDispatch();

  const moveNorth = () => dispatch(playerMovingNorth());
  const moveSouth = () => dispatch(playerMovingSouth());
  const moveEast = () => dispatch(playerMovingEast());

  const areaCells = useSelector(getCurrentMapCells);

  const translatedPlayerPos = useSelector(getTranslatedPlayerMapPos);

  const renderMapCell = (cellType: AREA_CELL_TYPES, x: number, y: number) => {
    if (!AreaCellDisplayDefs[cellType]) {
      return (<div key={`${x},${y}`} className="mapCell"></div>)
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
      inlineStyle.animationDelay = `-${rng(0.5)}s`;
    } else if (cellType === AREA_CELL_TYPES.Forest) {
      inlineStyle.animationDelay = `-${rng(0.3)}s`;
    } else if (cellType === AREA_CELL_TYPES.Water) {
      const delay = (x * 0.2) + (y * 0.2)
      inlineStyle.animationDelay = `-${delay}s`;
    }

    return (
      <div key={`${x},${y}`} className="mapCell">
        <div className={"cellIcon " + AreaCellDisplayDefs[cellType].cssClass}>
            {AreaCellDisplayDefs[cellType].iconPath
              ? <img  style={inlineStyle} src={AreaCellDisplayDefs[cellType].iconPath} alt={AreaCellDisplayDefs[cellType].name} />
              : <span style={inlineStyle}>{AreaCellDisplayDefs[cellType].content}</span>
            }
        </div>
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
    <Stack>
      <Box className="mapContainer">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="mapRow">
            {row.map(content => content)}
          </div>
        ))}
      </Box>

      <Stack direction='row' justify='center' align='center'>
        <Box>
          <Button onClick={() => dispatch(playerMovingWest())}>West</Button>
        </Box>
        <Stack direction='column'>
          <Button onClick={moveNorth}>North</Button>
          <Button onClick={moveSouth}>South</Button>
        </Stack>
        <Box>
          <Button onClick={moveEast}>East</Button>
        </Box>
      </Stack>
    </Stack>
  );
};