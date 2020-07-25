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
  sellItemToShop,
  harvestResourceNode,
  addSkillPoints,
  playerManaModified,
  playerSkillIncreased,
  updateSkill,
  playerEquippedItem,
  updateEquipment,
  playerUnequippedItem,
  playerUsedItem,
  applyEffectsToPlayer, playerStatsModified,
} from 'redux/character/character.slice';
import {
  getCharacterObject,
  getCurrentMapId,
  getPlayerCanHarvestResources,
  getPlayerEquipment,
  getPlayerGold,
  getPlayerInventory,
  getPlayerLocation,
  getPlayerMapPos,
  getPlayerSkills,
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
  getResourceNodesAtPlayerPos,
} from '../mapAreas/mapAreas.selectors';
import {
  NullAction,
  select,
} from 'utilities/redux.utilities';
import {
  removeItemFromMapCell,
  addItemToMapCell,
  removeItemFromShop,
  addItemToShop,
} from 'redux/mapAreas/mapAreas.slice';
import { FACILITY_TYPE } from 'data/areas.consts';
import { addMessage } from 'redux/messages/messages.slice';
import {
  itemCreated,
  toolUsed,
} from 'redux/items/items.slice';
import {
  NODE_KEYS,
  ResourceNodeDefs,
} from 'data/resources.consts';
import {
  ITEM_KEYS,
  ItemDefs,
} from 'data/item.consts';
import {
  SKILL_KEYS,
  SkillDefs,
} from 'data/skills.consts';
import {
  CharacterSkillFactory,
  EquipmentSlots,
} from 'models/character';
import { ItemFactory } from 'models/item';
import {EffectType} from "models/character/effects";
import {rng} from "utilities/random.utilities";

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
  map((action) => {
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
    addMessage({ content: `Picked up ${action.payload.name}.` }),
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
    addMessage({ content: `Dropped ${action.payload.name} from inventory.` }),
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
    addMessage({ content: `You enjoy a fine meal at the Tavern.` }),
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
    playerManaModified(character.stats.manaMax),
    playerGoldModified(-cost),
    playerLeavingFacility(),
    addMessage({ content: `You rest at the Inn and wake up feeling refreshed.` }),
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
    && playerGold >= action.payload.goldValue
  )),
  mergeMap(([action, playerLocation, facility]) => [
    addToInventory(action.payload),
    playerGoldModified(-action.payload.goldValue),
    removeItemFromShop(playerLocation.mapId, facility!.id, action.payload.id),
    addMessage({ content: `Bought ${action.payload.name} for ${action.payload.goldValue} Gold.` }),
  ]),
);

export const sellItemToShop$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(sellItemToShop.match),
  withLatestFrom(
    state$.pipe(select(getPlayerLocation)),
    state$.pipe(select(getPlayersCurrentFacility)),
  ),
  filter(([action,,facility]) => !!(facility && facility.type === FACILITY_TYPE.Shop)),
  mergeMap(([action, playerLocation, facility]) => [
    removeFromInventory(action.payload),
    playerGoldModified(action.payload.goldValue),
    addItemToShop(playerLocation.mapId, facility!.id, action.payload.id),
    addMessage({ content: `Sold ${action.payload.name} for ${action.payload.goldValue} Gold.` }),
  ]),
);

export const playerSkillIncreased$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerSkillIncreased.match),
  withLatestFrom(
    state$.pipe(select(getPlayerSkills)),
  ),
  mergeMap(([action, skills]) => {
    const actions: Action[] = [];
    const newSkill = CharacterSkillFactory({
      skillKey: action.payload.skillKey,
      ...skills.find(s => s.skillKey === action.payload.skillKey),
    });

    newSkill.points += action.payload.points;
    if (newSkill.points >= newSkill.pointsToLevel) {
      newSkill.points -= newSkill.pointsToLevel;
      newSkill.level++;
      actions.push(addMessage({ content: `Your ${SkillDefs[newSkill.skillKey].name} skill has leveled up to ${newSkill.level}!` }));
    }

    return actions.concat(updateSkill(newSkill));
  }),
);

export const harvestResourceNode$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(harvestResourceNode.match),
  withLatestFrom(
    state$.pipe(select(getResourceNodesAtPlayerPos)),
    state$.pipe(select(getPlayerCanHarvestResources)),
    state$.pipe(select(getPlayerInventory)),
  ),
  filter(([action, resourceNodes, canHarvest]) => {
    const node = resourceNodes.find(node => node.id === action.payload);
    return !!(node && canHarvest[node.type]);
  }),
  mergeMap(([action, resourceNodes,,inventory]) => {
    const node = resourceNodes.find(n => n.id === action.payload);
    if (!node) return [];
    const actions: Action[] = [];

    const nodeDef = ResourceNodeDefs[node.type];

    if (nodeDef.requiresTool) {
      const tool = inventory.find(i => i.key === nodeDef.requiresTool && i.toolProps && i.toolProps.remainingUses > 0);
      if (!tool) return[];
      actions.push(toolUsed(tool));
    }

    if (nodeDef.yieldsItem) {
      if (!nodeDef.yieldBaseChance || rng(100) <= nodeDef.yieldBaseChance) {
        const harvestedItem = ItemFactory(ItemDefs[ResourceNodeDefs[node!.type].yieldsItem]);
        actions.push(
          itemCreated(harvestedItem),
          addToInventory(harvestedItem),
          addMessage({ content: `Successfully harvested the ${node.name} and gathered ${harvestedItem.name}` }),
        );
      } else {
        actions.push(addMessage({ content: `Failed to harvest the ${node.name}` }));
      }
    }

    actions.push(playerSkillIncreased(SKILL_KEYS.Woodcutting, 1));
    return actions;
  }),
);

export const playerEquippedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerEquippedItem.match),
  withLatestFrom(
    state$.pipe(select(getPlayerEquipment)),
    state$.pipe(select(getPlayerInventory)),
  ),
  filter(([{ payload: equipItem },, inventory]) => !!(equipItem.equipProps && inventory.find(i => i.id === equipItem.id))),
  mergeMap(([{ payload: equipItem }, equipment]) => {
    const actions: Action[] = [];
    const existingItem = equipment[equipItem.equipProps!.slotKey];

    if (existingItem !== null) {
      actions.push(addToInventory(existingItem))
    }

    return actions.concat(
      removeFromInventory(equipItem),
      updateEquipment({
        [equipItem.equipProps!.slotKey]: equipItem.id,
      }),
    );
  }),
);

export const playerUnequippedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerUnequippedItem.match),
  withLatestFrom(
    state$.pipe(select(getPlayerEquipment)),
  ),
  filter(([{ payload: item }, equipment]) => !!(item.equipProps && equipment[item.equipProps.slotKey]?.id === item.id)),
  mergeMap(([{ payload: item }, equipment]) => {
    return [
      addToInventory(item),
      updateEquipment({ [item.equipProps!.slotKey]: null }),
    ];
  }),
);

export const playerUsedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerUsedItem.match),
  withLatestFrom(
    state$.pipe(select(getPlayerInventory)),
  ),
  filter(([{ payload: item }, inventory]) => !!(item.useProps && inventory.find(i => i.id === item.id))),
  mergeMap(([{ payload: item }, inventory]) => {
    console.log(`item effects:`, item.useProps!.effects);
    return [
      applyEffectsToPlayer(item.useProps!.effects),
      // removeFromInventory(item),
    ];
  }),
);

export const applyEffects$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(applyEffectsToPlayer.match),
  withLatestFrom(
    state$.pipe(select(getPlayerStats)),
  ),
  mergeMap(([{ payload: effects }, stats]) => {
    const actions: Action[] = [];
    effects.forEach(effect => {
      if (effect.type === EffectType.fixed) {
        actions.push(playerStatsModified(effect.statModifiers));
      }
      // console.log(`${effect.type} effect ${effect.name}:`, effect);
    });
    return actions;
  }),
);
