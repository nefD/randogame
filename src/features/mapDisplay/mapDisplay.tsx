import React from 'react';

import 'features/mapDisplay/mapDisplay.scss';
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
export const MapDisplay = () => {

  const mapArea = useSelector(getCurrentMapArea);

  const dispatch = useDispatch();

  const moveNorth = () => dispatch(playerMovingNorth());
  const moveSouth = () => dispatch(playerMovingSouth());
  const moveEast = () => dispatch(playerMovingEast());

  const areaCells = useSelector(getCurrentMapCells);

  const translatedPlayerPos = useSelector(getTranslatedPlayerMapPos);

  const renderMapCell = (cellType: AREA_CELL_TYPES, x: number, y: number) => {
    // if (!cellType) {
    //   return (
    //     <div></div>
    //   );
    // }
    return (
      <div key={`${x},${y}`} className="mapCell">
        {/*<div className="cellIcon">*/}
        {/*  <img src="/peaks.svg" alt=""/>*/}
        {/*</div>*/}
        {translatedPlayerPos.x === x && translatedPlayerPos.y === y
          // ? <div className={"cellIcon " + PlayerCellDisplayDef.cssClass} id={`${x},${y} - ${cell.id}`}>
          //     {PlayerCellDisplayDef.content}
          //   </div>
          // : <div className={"cellIcon " + AreaCellDisplayDefs[cell.type].cssClass} id={`${cell.x},${cell.y} - ${cell.id}`}>
          //     {AreaCellDisplayDefs[cell.type].content}
          //   </div>
          ? <div className={"cellIcon " + PlayerCellDisplayDef.cssClass}>
            {PlayerCellDisplayDef.content}
          </div>
          : <div className={"cellIcon " + AreaCellDisplayDefs[cellType].cssClass}>
            {AreaCellDisplayDefs[cellType].content}
          </div>
        }
      </div>
    );
  }


  const rows: Array<JSX.Element[]> = [];
  if (mapArea) {
    for (let y = 0; y < areaCells[0].length; y++) {
      let row: JSX.Element[] = [];
      for (let x = 0; x < areaCells.length; x++) {
        // let cellType = areaCells[x][y];
        row.push(renderMapCell(areaCells[x][y], x, y));
      }
      rows.push(row);
    }
  }

  // const rows: Array<JSX.Element[]> = [];
  // areaCells.map((mapRow, rowIdx) => {
  //   const row: JSX.Element[] = [];
  //   mapRow.map(cell => row.unshift(renderMapCell(cell)));
  //   rows.push(row);
  // });

  return (
    <Stack>
      <Box className="mapContainer">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="mapRow">
            {row.map(content => content)}
          </div>
        ))}
        {/*{areaCells.map((row, rowIdx) =>*/}
        {/*  <div key={rowIdx} className="mapRow">*/}
        {/*    {row.map(cell => renderMapCell(cell))}*/}
        {/*  </div>*/}
        {/*)}*/}
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
