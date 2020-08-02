import { Action } from 'redux';
import {
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import * as characterActions from 'redux/character/character.slice';
import * as characterSelectors from 'redux/character/character.selectors';
import { RootState } from 'app/rootReducer';
import { Epic } from 'redux-observable';
import * as mapAreaSelectors from 'redux/mapAreas/mapAreas.selectors';
import {
  select,
} from 'utilities/redux.utilities';
import {
  removeItemFromMapCell,
  addItemsToMapCell,
  removeItemFromShop,
  addItemToShop,
} from 'redux/mapAreas/mapAreas.slice';
import { FACILITY_TYPE } from 'data/areas.consts';
import { ResourceNodeDefs } from 'data/resources.consts';
import { getItemDef, ItemDefs } from 'data/item.consts';
import {
  SKILL_KEY,
  SkillDefs,
} from 'data/skills.consts';
import { ItemFactory } from 'models/item';
import { EffectType } from "models/character/effects";
import { rng } from "utilities/random.utilities";
import {CharacterSkillFactory} from "models/character/skill";
import { addAbilities, addRecipes, usedTool } from "redux/character/character.slice";
import { getPlayerInventory, getPlayerRecipes } from "redux/character/character.selectors";
import { getRecipe } from "data/recipes.consts";
import { setLocalStorageItem } from "utilities/sessionStorage.utilities";
import { writeStorage } from '@rehooks/local-storage';
import { addGameMessage } from "utilities/messages.utilities";

export const playerMovingNorth$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerMovingNorth.match),
  withLatestFrom(state$),
  filter(([, state]) => characterSelectors.getPlayerLocation(state).coords.y > 0),
  map(([, state]) => {
    const playerLocation = characterSelectors.getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        y: playerLocation.coords.y - 1,
      },
    };
    return characterActions.playerMoved(newLocation);
  })
);

export const playerMovingSouth$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerMovingSouth.match),
  withLatestFrom(state$),
  filter(([, state]) => characterSelectors.getPlayerLocation(state).coords.y < mapAreaSelectors.getCurrentMapAreaHeight(state) - 1),
  map(([, state]) => {
    const playerLocation = characterSelectors.getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        y: playerLocation.coords.y + 1,
      },
    };
    return characterActions.playerMoved(newLocation);
  })
);

export const playerMovingEast$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerMovingEast.match),
  withLatestFrom(state$),
  filter(([, state]) => characterSelectors.getPlayerLocation(state).coords.x < mapAreaSelectors.getCurrentMapAreaWidth(state) - 1),
  map(([, state]) => {
    const playerLocation = characterSelectors.getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        x: playerLocation.coords.x + 1,
      },
    };
    return characterActions.playerMoved(newLocation);
  })
);

export const playerMovingWest$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerMovingWest.match),
  withLatestFrom(state$),
  filter(([, state]) => characterSelectors.getPlayerLocation(state).coords.x > 0),
  map(([, state]) => {
    const playerLocation = characterSelectors.getPlayerLocation(state);
    const newLocation = {
      ...playerLocation,
      coords: {
        ...playerLocation.coords,
        x: playerLocation.coords.x - 1,
      },
    };
    return characterActions.playerMoved(newLocation);
  })
);

export const playerMoved$: Epic<Action, Action, RootState> = (actions$) => actions$.pipe(
  filter(characterActions.playerMoved.match),
  map(() => characterActions.playerHungerModified(-1)),
);

export const pickUpItemFromAreaCell$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.pickUpItemFromCurrentMapCell.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getCurrentMapId)),
    state$.pipe(select(characterSelectors.getPlayerMapPos))
  ),
  mergeMap(([{ payload: item }, mapId, playerPos]) => {
    addGameMessage(`Picked up ${item.name}.`);
    return [
      removeItemFromMapCell(mapId, playerPos.x, playerPos.y, item),
      characterActions.addToInventory([item]),
    ];
  }),
);

export const dropItemFromInventory$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.dropItemFromInventory.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getCurrentMapId)),
    state$.pipe(select(characterSelectors.getPlayerMapPos))
  ),
  mergeMap(([{ payload: item }, mapId, playerPos]) => {
    addGameMessage(`Dropped ${item.name} from inventory.`);
    return [
      addItemsToMapCell(mapId, playerPos.x, playerPos.y, [item]),
      characterActions.removeFromInventory([item]),
    ]
  }),
);

export const playerAttacked$: Epic<Action, Action, RootState> = (actions$) => actions$.pipe(
  filter(characterActions.playerWasAttacked.match),
  map((action) => characterActions.playerTakingDamage(action.payload.damage)),
);

export const playerUsedTavern$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerUsedTavern.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getCharacterObject)),
    state$.pipe(select(mapAreaSelectors.getPlayerTavernCost)),
  ),
  mergeMap(([, character, cost]) => {
    addGameMessage(`You enjoy a fine meal at the Tavern.`);
    return [
      characterActions.playerHungerModified(character.stats.hungerMax),
      characterActions.playerGoldModified(-cost),
      characterActions.playerLeavingFacility(),
    ]
  }),
);

export const playerUsedInn$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerUsedInn.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getCharacterObject)),
    state$.pipe(select(mapAreaSelectors.getPlayerInnCost)),
  ),
  mergeMap(([, character, cost]) => {
    addGameMessage(`You rest at the Inn and wake up feeling refreshed.`);
    return [
      characterActions.playerHealthModified(character.stats.healthMax),
      characterActions.playerManaModified(character.stats.manaMax),
      characterActions.playerGoldModified(-cost),
      characterActions.playerLeavingFacility(),
    ]
  }),
);

export const addToInventory$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.addToInventory.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getCharacterObject)),
  ),
  map(([{ payload: items }, character]) => (character.inventory.length >= character.inventoryMax)
    ? addItemsToMapCell(character.location.mapId, character.location.coords.x, character.location.coords.y, items)
    : characterActions.inventoryAdded(items),
  ),
);

export const buyItemFromShop$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.buyItemFromShop.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerLocation)),
    state$.pipe(select(mapAreaSelectors.getPlayersCurrentFacility)),
    state$.pipe(select(characterSelectors.getPlayerGold)),
  ),
  filter(([{ payload: item },, facility, playerGold]) => !!(
    facility
    && facility.type === FACILITY_TYPE.Shop
    && facility.shopItems.includes(item)
    && playerGold >= item.goldValue
  )),
  mergeMap(([{ payload: item }, playerLocation, facility]) => {
    addGameMessage(`Bought ${item.name} for ${item.goldValue} Gold.`);
    return [
      characterActions.addToInventory([item]),
      characterActions.playerGoldModified(-item.goldValue),
      removeItemFromShop(playerLocation.mapId, facility!.id, item),
    ]
  }),
);

export const sellItemToShop$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.sellItemToShop.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerLocation)),
    state$.pipe(select(mapAreaSelectors.getPlayersCurrentFacility)),
  ),
  filter(([,,facility]) => !!(facility && facility.type === FACILITY_TYPE.Shop)),
  mergeMap(([{ payload: item }, playerLocation, facility]) => {
    addGameMessage(`Sold ${item.name} for ${item.goldValue} Gold.`);
    return [
      characterActions.removeFromInventory([item]),
      characterActions.playerGoldModified(item.goldValue),
      addItemToShop(playerLocation.mapId, facility!.id, item),
    ]
  }),
);

export const playerSkillIncreased$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerSkillIncreased.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerSkills)),
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
      addGameMessage(`Your ${SkillDefs[newSkill.skillKey].name} skill has leveled up to ${newSkill.level}!`);
    }

    return actions.concat(characterActions.updateSkill(newSkill));
  }),
);

export const harvestResourceNode$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.harvestResourceNode.match),
  withLatestFrom(
    state$.pipe(select(mapAreaSelectors.getResourceNodesAtPlayerPos)),
    state$.pipe(select(characterSelectors.getPlayerCanHarvestResources)),
    state$.pipe(select(characterSelectors.getPlayerInventory)),
  ),
  filter(([{ payload: nodeId }, resourceNodes, canHarvest]) => {
    const node = resourceNodes.find(node => node.id === nodeId);
    return !!(node && canHarvest[node.type]);
  }),
  mergeMap(([{ payload: nodeId }, resourceNodes,,inventory]) => {
    const node = resourceNodes.find(n => n.id === nodeId);
    const actions: Action[] = [];
    const nodeDef = ResourceNodeDefs[node!.type];

    if (nodeDef.requiresTool) {
      const tool = inventory.find(i => i.key === nodeDef.requiresTool && i.toolProps && i.toolProps.remainingUses > 0);
      if (!tool) return[];
      actions.push(usedTool(tool));
    }

    if (nodeDef.yieldsItem) {
      if (!nodeDef.yieldBaseChance || rng(100) <= nodeDef.yieldBaseChance) {
        const harvestedItem = ItemFactory(ItemDefs[ResourceNodeDefs[node!.type].yieldsItem]);
        addGameMessage(`Successfully harvested the ${node!.name} and gathered ${harvestedItem.name}`);
        actions.push(
          characterActions.addToInventory([harvestedItem]),
        );
      } else {
        addGameMessage(`Failed to harvest the ${node!.name}`);
      }
    }

    actions.push(characterActions.playerSkillIncreased(SKILL_KEY.Woodcutting, 1));
    return actions;
  }),
);

export const playerEquippedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerEquippedItem.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerEquipment)),
    state$.pipe(select(characterSelectors.getPlayerInventory)),
  ),
  filter(([{ payload: equipItem },, inventory]) => !!(equipItem.equipProps && inventory.find(i => i.id === equipItem.id))),
  mergeMap(([{ payload: equipItem }, equipment]) => {
    const actions: Action[] = [];
    const existingItem = equipment[equipItem.equipProps!.slotKey];

    if (existingItem !== null) {
      actions.push(characterActions.addToInventory([existingItem]))
    }

    return actions.concat(
      characterActions.removeFromInventory([equipItem]),
      characterActions.updateEquipment({
        [equipItem.equipProps!.slotKey]: equipItem,
      }),
    );
  }),
);

export const playerUnequippedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerUnequippedItem.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerEquipment)),
  ),
  filter(([{ payload: item }, equipment]) => !!(item.equipProps && equipment[item.equipProps.slotKey]?.id === item.id)),
  mergeMap(([{ payload: item }]) => {
    return [
      characterActions.addToInventory([item]),
      characterActions.updateEquipment({ [item.equipProps!.slotKey]: null }),
    ];
  }),
);

export const playerUsedItem$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.playerUsedItem.match),
  withLatestFrom(
    state$.pipe(select(characterSelectors.getPlayerInventory)),
  ),
  filter(([{ payload: item }, inventory]) => !!(item.useProps && inventory.find(i => i.id === item.id))),
  mergeMap(([{ payload: item }]) => {
    const actions: Action[] = [
      characterActions.removeFromInventory([item]),
    ];
    if (item.useProps!.giveAbilities) {
      actions.push(addAbilities(item.useProps!.giveAbilities));
    }
    if (item.useProps!.giveRecipes) {
      actions.push(addRecipes(item.useProps!.giveRecipes));
    }
    if (item.useProps!.effects) {
      actions.push(characterActions.applyEffectsToPlayer(item.useProps!.effects));
    }
    return actions;
  }),
);

export const applyEffects$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.applyEffectsToPlayer.match),
  mergeMap(({ payload: effects }) => {
    const actions: Action[] = [];
    effects.forEach(effect => {
      if (effect.type === EffectType.fixed) {
        actions.push(characterActions.playerStatsModified(effect.statModifiers));
      }
    });
    return actions;
  }),
);

export const craftRecipe$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(characterActions.craftRecipe.match),
  withLatestFrom(
    state$.pipe(select(getPlayerInventory)),
    state$.pipe(select(getPlayerRecipes)),
  ),
  filter(([{ payload: recipeKey }, inventory, recipes]) =>
    recipes.includes(recipeKey)
    && getRecipe(recipeKey).requires.every(c => (inventory.find(i => i.key === c.itemKey)?.quantity || 0) >= c.quantity),
  ),
  mergeMap(([{ payload: recipeKey }]) => [
    characterActions.removeFromInventoryByKey(getRecipe(recipeKey).requires),
    characterActions.addToInventory(
      getRecipe(recipeKey).yields.map(y => ItemFactory({
        ...getItemDef(y.itemKey),
        quantity: y.quantity,
      })),
    ),
  ]),
);
