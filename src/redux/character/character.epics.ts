import { Action } from 'redux';
import {
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  playerMovingNorth,
  playerMoved,
  playerMovingSouth,
  playerMovingEast,
  playerMovingWest,
  pickUpItemFromCurrentMapCell,
  addToInventory,
  dropItemFromInventory,
  removeFromInventory,
  playerAttacked,
  playerTakingDamage,
  playerHungerModified,
  playerUsedTavern,
  playerUsedInn,
  playerHealthModified,
  playerLeavingFacility,
} from 'redux/character/character.slice';
import {
  getCharacterObject,
  getCurrentMapId,
  getPlayerLocation,
  getPlayerMapPos,
  getPlayerStats,
} from 'redux/character/character.selectors';
import { RootState } from 'app/rootReducer';
import { Epic } from 'redux-observable';
import {
  getCurrentMapAreaHeight,
  getCurrentMapAreaWidth,
} from '../mapAreas/mapAreas.selectors';
import {
  NullAction,
  select,
} from 'utilities/redux.utilities';
import {
  removeItemFromMapCell,
  addItemToMapCell,
} from 'redux/mapAreas/mapAreas.slice';

export const playerMovingNorth$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMovingNorth.match),
  withLatestFrom(state$),
  filter(([_, state]) => getPlayerLocation(state).coords.y > 0),
  map(([action, state]) => {
    const playerLocation = getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        y: playerLocation.coords.y - 1,
      },
    };
    return playerMoved(newLocation);
  })
);

export const playerMovingSouth$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMovingSouth.match),
  withLatestFrom(state$),
  filter(([_, state]) => getPlayerLocation(state).coords.y < getCurrentMapAreaHeight(state) - 1),
  map(([_, state]) => {
    const playerLocation = getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        y: playerLocation.coords.y + 1,
      },
    };
    return playerMoved(newLocation);
  })
);

export const playerMovingEast$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMovingEast.match),
  withLatestFrom(state$),
  filter(([_, state]) => getPlayerLocation(state).coords.x < getCurrentMapAreaWidth(state) - 1),
  map(([_, state]) => {
    const playerLocation = getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        x: playerLocation.coords.x + 1,
      },
    };
    return playerMoved(newLocation);
  })
);

export const playerMovingWest$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMovingWest.match),
  withLatestFrom(state$),
  filter(([_, state]) => getPlayerLocation(state).coords.x > 0),
  map(([_, state]) => {
    const playerLocation = getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        x: playerLocation.coords.x - 1,
      },
    };
    return playerMoved(newLocation);
  })
);

export const playerMoved$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMoved.match),
  withLatestFrom(
    state$.pipe(select(getPlayerStats)),
  ),
  map(([action, stats]) => {
    if (stats.hunger - 10 <= 0) {
      console.log(`player starved to death!`);
    }
    return playerHungerModified(-10);
  }),
);

export const pickUpItemFromAreaCell$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(pickUpItemFromCurrentMapCell.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapId)),
    state$.pipe(select(getPlayerMapPos))
  ),
  mergeMap(([action, mapId, playerPos]) => [
    removeItemFromMapCell(mapId, playerPos.x, playerPos.y, action.payload),
    addToInventory(action.payload),
  ]),
);

export const dropItemFromInventory$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(dropItemFromInventory.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapId)),
    state$.pipe(select(getPlayerMapPos))
  ),
  mergeMap(([action, mapId, playerPos]) => [
    addItemToMapCell(mapId, playerPos.x, playerPos.y, action.payload),
    removeFromInventory(action.payload),
  ]),
);

export const playerAttacked$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerAttacked.match),
  withLatestFrom(
    state$.pipe(select(getCharacterObject)),
  ),
  map(([action, player]) => {
    const health = Math.max(0, player.stats.health - action.payload.damage);
    if (health <= 0) {
      console.log(`player is dead!`);
      return NullAction();
    }
    return playerTakingDamage(action.payload.damage);
  }),
);

export const playerUsedTavern$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerUsedTavern.match),
  withLatestFrom(
    state$.pipe(select(getCharacterObject)),
  ),
  mergeMap(([action, character]) => [
    playerHungerModified(character.stats.hungerMax),
    playerLeavingFacility(),
  ]),
);

export const playerUsedInn$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerUsedInn.match),
  withLatestFrom(
    state$.pipe(select(getCharacterObject)),
  ),
  mergeMap(([action, character]) => [
    playerHealthModified(character.stats.healthMax),
    playerLeavingFacility(),
  ]),
);
