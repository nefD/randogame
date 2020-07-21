
import { createSelector } from 'reselect';
import {
  itemSelectors,
} from '../items/items.selectors';
import { Item } from '../items/items.slice';
import {
  getCharacter,
  getEnemiesState,
  getItemsState,
} from 'app/baseSelectors';
import { enemiesSelectors } from 'redux/enemies/enemies.selectors';

export const getCharacterObject = createSelector(
  getCharacter,
  char => char,
);

export const getCharacterName = createSelector(
  getCharacter,
  state => state.name,
);

export const getPlayerStats = createSelector(
  getCharacter,
  state => state.stats,
);

export const getPlayerHealth = createSelector(
  getPlayerStats,
  stats => stats.health,
);

export const getPlayerIsDead = createSelector(
  getPlayerStats,
  stats => stats.health <= 0 || stats.hunger <= 0,
);

export const getPlayerRace = createSelector(
  getCharacter,
  state => state.race,
);

export const getPlayerClass = createSelector(
  getCharacter,
  state => state.class,
);

export const getPlayerGold = createSelector(
  getCharacter,
  state => state.gold,
);

export const getPlayerLocation = createSelector(
  getCharacter,
  state => state.location,
);

export const getCurrentMapId = createSelector(
  getCharacter,
  state => state.location.mapId,
);

export const getPlayerMapLocation = createSelector(
  getCharacter,
  state => state.location,
);

export const getPlayerMapPos = createSelector(
  getPlayerMapLocation,
  location => location.coords,
);

export const getPlayerInventory = createSelector(
  getCharacter,
  getItemsState,
  (character, itemsState) => character.inventory.reduce((list: Item[], id: string) => {
    const item = itemSelectors.selectById(itemsState, id);
    if (item) {
      list.push(item);
    }
    return list;
  }, []),
);

export const getPlayerGameState = createSelector(
  getCharacter,
  state => state.gameState,
);

export const getPlayerCombatState = createSelector(
  getCharacter,
  state => state.combatState,
);

export const getPlayerCombatEnemy = createSelector(
  getPlayerCombatState,
  getEnemiesState,
  (combatState, enemiesState) => enemiesSelectors.selectById(enemiesState, combatState.enemy),
);
