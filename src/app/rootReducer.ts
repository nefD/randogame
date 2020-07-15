import { combineReducers } from '@reduxjs/toolkit';

import foobarReducer from 'features/foobar/foobarSlice';
import characterReducer from 'redux/character/character.slice';
import mapAreasReducer from 'redux/mapAreas/mapAreas.slice';
import { combineEpics } from 'redux-observable';
// import {
//   dropItemFromInventory$,
//   pickUpItemFromAreaCell$,
//   playerMovingEast$,
//   playerMovingNorth$,
//   playerMovingSouth$,
//   playerMovingWest$,
// } from 'redux/character/character.epics';
import itemsReducer from 'redux/items/items.slice';
import { generateMap$ } from 'redux/mapAreas/mapAreas.epics';
import areaCellReducer from 'redux/areaCells/areaCells.slice';
import enemiesReducer from 'redux/enemies/enemies.slice';
import { enemyAttacked$ } from 'redux/enemies/enemies.epics';
import * as combatEpics from 'redux/combat/combat.epics';
import * as characterEpics from 'redux/character/character.epics';

const rootReducer = combineReducers({
  foobar: foobarReducer,
  character: characterReducer,
  mapAreas: mapAreasReducer,
  items: itemsReducer,
  enemies: enemiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

export const rootEpic = combineEpics(
  generateMap$,
  enemyAttacked$,
  ...Object.values(combatEpics),
  ...Object.values(characterEpics),
);
