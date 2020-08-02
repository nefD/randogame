import { combineReducers } from '@reduxjs/toolkit';

import characterReducer from 'redux/character/character.slice';
import mapAreasReducer from 'redux/mapAreas/mapAreas.slice';
import { combineEpics } from 'redux-observable';
import itemsReducer from 'redux/items/items.slice';
import enemiesReducer from 'redux/enemies/enemies.slice';
import messagesReducer from 'redux/messages/messages.slice';
import * as combatEpics from 'redux/combat/combat.epics';
import * as characterEpics from 'redux/character/character.epics';
import * as enemyEpics from 'redux/enemies/enemies.epics';
import * as mapAreaEpics from 'redux/mapAreas/mapAreas.epics';

const rootReducer = combineReducers({
  character: characterReducer,
  mapAreas: mapAreasReducer,
  enemies: enemiesReducer,
  messages: messagesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

export const rootEpic = combineEpics(
  ...Object.values(mapAreaEpics),
  ...Object.values(enemyEpics),
  ...Object.values(combatEpics),
  ...Object.values(characterEpics),
);
