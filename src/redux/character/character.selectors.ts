
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
import { AREA_RESOURCE_TYPE } from 'data/resources.consts';

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

export const getPlayerSkills = createSelector(
  getCharacter,
  state => state.skills,
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

export const getPlayerCanHarvestResources = createSelector(
  getPlayerInventory,
  items => ({
    [AREA_RESOURCE_TYPE.Plant]: true,
    [AREA_RESOURCE_TYPE.Tree]: (items.filter(i => i.key === 'WoodAxe' && i.toolProps && i.toolProps.remainingUses > 0).length > 0),
    [AREA_RESOURCE_TYPE.Stone]: false,
    [AREA_RESOURCE_TYPE.Mine]: false,
    [AREA_RESOURCE_TYPE.Stick]: true,
    [AREA_RESOURCE_TYPE.Sand]: true,
  }),
)
