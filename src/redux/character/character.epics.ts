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
  inventoryAdded,
  dropItemFromInventory,
  removeFromInventory,
  playerAttacked,
  playerTakingDamage,
  playerHungerModified,
  playerUsedTavern,
  playerUsedInn,
  playerHealthModified,
  playerLeavingFacility,
  playerGoldModified,
  addToInventory,
  buyItemFromShop,
} from 'redux/character/character.slice';
import {
  getCharacterObject,
  getCurrentMapId,
  getPlayerGold,
  getPlayerLocation,
  getPlayerMapPos,
  getPlayerStats,
} from 'redux/character/character.selectors';
import { RootState } from 'app/rootReducer';
import { Epic } from 'redux-observable';
import {
  getCurrentMapAreaHeight,
  getCurrentMapAreaWidth,
  getPlayerInnCost,
  getPlayersCurrentFacility,
  getPlayerTavernCost,
} from '../mapAreas/mapAreas.selectors';
import {
  NullAction,
  select,
} from 'utilities/redux.utilities';
import {
  removeItemFromMapCell,
  addItemToMapCell,
  removeItemFromShop,
} from 'redux/mapAreas/mapAreas.slice';
import { FACILITY_TYPE } from 'data/areas.consts';

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
    if (stats.hunger - 1 <= 0) {
      console.log(`player starved to death!`);
    }
    return playerHungerModified(-1);
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
    state$.pipe(select(getPlayerTavernCost)),
  ),
  mergeMap(([action, character, cost]) => [
    playerHungerModified(character.stats.hungerMax),
    playerGoldModified(-cost),
    playerLeavingFacility(),
  ]),
);

export const playerUsedInn$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerUsedInn.match),
  withLatestFrom(
    state$.pipe(select(getCharacterObject)),
    state$.pipe(select(getPlayerInnCost)),
  ),
  mergeMap(([action, character, cost]) => [
    playerHealthModified(character.stats.healthMax),
    playerGoldModified(-cost),
    playerLeavingFacility(),
  ]),
);

export const addToInventory$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(addToInventory.match),
  withLatestFrom(
    state$.pipe(select(getCharacterObject)),
  ),
  map(([action, character]) => {
    if (character.inventory.length >= character.inventoryMax) {
      return addItemToMapCell(character.location.mapId, character.location.coords.x, character.location.coords.y, action.payload);
    }
    return inventoryAdded(action.payload);
  }),
);

export const buyItemFromShop$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(buyItemFromShop.match),
  withLatestFrom(
    state$.pipe(select(getPlayerLocation)),
    state$.pipe(select(getPlayersCurrentFacility)),
    state$.pipe(select(getPlayerGold)),
  ),
  filter(([action,, facility, playerGold]) => !!(
    facility
    && facility.type === FACILITY_TYPE.Shop
    && facility.shopItems.includes(action.payload.id)
    && playerGold >= action.payload.value
  )),
  mergeMap(([action, playerLocation, facility]) => [
    addToInventory(action.payload),
    playerGoldModified(-action.payload.value),
    removeItemFromShop(playerLocation.mapId, facility!.id, action.payload.id),
  ]),
);
