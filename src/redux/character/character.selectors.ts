import { createSelector } from 'reselect';
import {
  getCharacter,
  getEnemiesState,
} from 'app/baseSelectors';
import { enemiesSelectors } from 'redux/enemies/enemies.selectors';
import { NODE_KEYS } from 'data/resources.consts';
import {
  EquipmentSlots,
} from 'models/character';
import { STATS, Stats, StatsKey } from 'models/character/stats';
import { AbilityDefs, AbilityKey } from "data/abilities.consts";
import { RecipeKey } from "data/recipes.consts";

export const getCharacterObject = createSelector(getCharacter, char => char);
export const getCharacterName = createSelector(getCharacter, state => state.name);
export const getPlayerRace = createSelector(getCharacter, state => state.race);
export const getPlayerClass = createSelector(getCharacter, state => state.class);
export const getPlayerSkills = createSelector(getCharacter, state => state.skills);
export const getPlayerGold = createSelector(getCharacter, state => state.gold);
export const getPlayerLocation = createSelector(getCharacter, state => state.location);
export const getCurrentMapId = createSelector(getCharacter, state => state.location.mapId);
export const getPlayerMapLocation = createSelector(getCharacter, state => state.location);
export const getPlayerMapPos = createSelector(getPlayerMapLocation, location => location.coords);
export const getPlayerGameState = createSelector(getCharacter, state => state.gameState);
export const getPlayerCombatState = createSelector(getCharacter, state => state.combatState);
export const getPlayerAbilities = createSelector(getCharacter, state => state.abilities as AbilityKey[]);
export const getPlayerRecipes = createSelector(getCharacter, state => state.recipes as RecipeKey[]);
export const getPlayerInventory = createSelector(getCharacter, state => state.inventory);
export const getPlayerLevel = createSelector(getCharacter, state => state.level);

export const getPlayerEquipment = createSelector(getCharacter, state => state.equipment);
export const getPlayerWeapon = createSelector(getPlayerEquipment, equipment => equipment[EquipmentSlots.Weapon]);

export const getPlayerStats = createSelector(
  getCharacter,
  getPlayerEquipment,
  (state, equipment) => {
    const stats: Stats = { ...state.stats };
    Object.values(equipment).forEach(item => {
      item?.equipProps?.bonuses?.forEach(bonus => {
        stats[bonus.statKey] += bonus.modifier;
      });
    });
    return stats;
  },
);

export const getPlayerCombatAbilities = createSelector(
  getPlayerAbilities,
  getPlayerStats,
  getPlayerWeapon,
  (abilities, stats, weapon) => abilities.map(key => {
    const ability = AbilityDefs[key];
    let enabled = stats[STATS.mana] >= ability.manaCost;
    if (enabled && ability.weaponRequired) {
      enabled = weapon?.equipProps?.skillKey === ability.skillKey;
    }
    return { key, enabled };
  }),
);

export const getPlayerHealth = createSelector(
  getPlayerStats,
  stats => stats.health,
);

export const getPlayerIsDead = createSelector(
  getPlayerStats,
  stats => stats.health <= 0 || stats.hunger <= 0,
);

// export const getPlayerInventory = createSelector(
//   getCharacter,
//   getItemsState,
//   (character, itemsState) => character.inventory.reduce((list: Item[], id: string) => {
//     const item = itemSelectors.selectById(itemsState, id);
//     if (item) {
//       list.push(item);
//     }
//     return list;
//   }, []),
// );

export const getPlayerCombatEnemy = createSelector(
  getPlayerCombatState,
  getEnemiesState,
  (combatState, enemiesState) => enemiesSelectors.selectById(enemiesState, combatState.enemy),
);

export const getPlayerCanHarvestResources = createSelector(
  getPlayerInventory,
  items => ({
    [NODE_KEYS.Tree]: (items.filter(i => i.key === 'WoodAxe' && i.toolProps && i.toolProps.remainingUses > 0).length > 0),
  }),
);
