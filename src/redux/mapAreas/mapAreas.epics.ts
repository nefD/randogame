import { Action } from "redux";
import { Epic } from "redux-observable";
import { RootState } from "app/rootReducer";
import {
  addEnemyToMapCell,
  addItemsToMapCell,
  addResourceNodeToMapCell,
  generateMap,
  mapAreaUpdated,
  refreshMapCell, refreshMapCellResources, refreshMapCellSpawns,
} from "./mapAreas.slice";
import { filter, map, mergeMap, withLatestFrom } from "rxjs/operators";
import { fromXY } from "utilities/mapAreas.utilities";
import { ItemDefs } from "data/items.consts";
import { playerMoved } from "../character/character.slice";
import { AreaCellResourceDefs } from "data/areas.consts";
import { generateMapArea } from "utilities/mapGeneration.utilities";
import { NullAction, select } from "utilities/redux.utilities";
import {
  getCurrentMapArea, getEnemiesAtPlayerPos,
  getItemsAtPlayerPos,
  getResourceNodesAtPlayerPos, getSpawnsAtPlayerPos,
} from "redux/mapAreas/mapAreas.selectors";
import { getPlayerLevel, getPlayerMapLocation } from "redux/character/character.selectors";
import { ResourceNodeDefs } from "data/resources.consts";
import { rng } from "utilities/random.utilities";
import { ResourceNodeFactory } from "utilities/resources.utilities";
import { MapLocationFactory } from "models/map";
import { ItemFactory } from "models/item";
import { ITEM_KEYS } from "data/items.keys";
import { FACILITY_KEYS } from "data/facilities.consts";
import { getSpawnDefinition, SPAWN_KEYS } from "data/spawns.consts";
import { EnemyFactory } from "models/enemy";
import { EnemyDefs, getEnemyDefinition } from "data/enemies.consts";
import { enemyCreated } from "redux/enemies/enemies.slice";

export const playerMoved$: Epic<Action, Action, RootState> = (
  actions$,
  state$
) =>
  actions$.pipe(
    filter(playerMoved.match),
    map(() => refreshMapCell())
  );

export const refreshMapCell$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(refreshMapCell.match),
  mergeMap(() => [
    refreshMapCellResources(),
    refreshMapCellSpawns(),
  ]),
);

export const refreshMapCellSpawns$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(refreshMapCellSpawns.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapArea)),
    state$.pipe(select(getPlayerLevel)),
    state$.pipe(select(getPlayerMapLocation)),
    state$.pipe(select(getEnemiesAtPlayerPos)),
    state$.pipe(select(getSpawnsAtPlayerPos)),
  ),
  filter(([, mapArea]) => !!mapArea),
  mergeMap(([, mapArea, playerLevel, playerLoc, enemies, spawns]) =>
    spawns
      .filter(s => !enemies.find(e => e.key === s.enemyKey))
      .filter(s => playerLevel >= s.minLevel || (!s.maxLevel || playerLevel <= s.maxLevel))
      .filter(s => rng(100) < s.chance)
      .map(spawn => addEnemyToMapCell(
        mapArea!.id,
        playerLoc.coords.x,
        playerLoc.coords.y,
        EnemyFactory(getEnemyDefinition(spawn.enemyKey).config),
      )),
  ),
);

export const refreshMapCellResources$: Epic<Action, Action, RootState> = (
  actions$,
  state$
) =>
  actions$.pipe(
    filter(refreshMapCellResources.match),
    withLatestFrom(
      state$.pipe(select(getCurrentMapArea)),
      state$.pipe(select(getPlayerMapLocation)),
      state$.pipe(select(getItemsAtPlayerPos)),
      state$.pipe(select(getResourceNodesAtPlayerPos))
    ),
    filter(([, mapArea]) => !!mapArea),
    mergeMap(([, mapArea, playerLoc, cellItems, resourceNodes]) => {
      const actions: Action[] = [];
      const cellType = mapArea!.cellTypes[
        fromXY(playerLoc.coords.x, playerLoc.coords.y, mapArea!.width)
      ];
      const resourceDefs = AreaCellResourceDefs[cellType] || [];
      resourceDefs.forEach((resourceDef) => {
        if (
          resourceDef.itemKey &&
          cellItems.filter((i) => i.key === resourceDef.itemKey).length <
            resourceDef.max
        ) {
          if (rng(100) < resourceDef.chance) {
            const item = ItemFactory(ItemDefs[resourceDef.itemKey]);
            actions.push(
              addItemsToMapCell(
                mapArea!.id,
                playerLoc.coords.x,
                playerLoc.coords.y,
                [item]
              )
            );
          }
        }

        if (
          resourceDef.nodeKey &&
          resourceNodes.filter((n) => n.key === resourceDef.nodeKey).length <
            resourceDef.max
        ) {
          if (rng(100) < resourceDef.chance) {
            actions.push(
              addResourceNodeToMapCell(
                mapArea!.id,
                playerLoc.coords.x,
                playerLoc.coords.y,
                ResourceNodeFactory(ResourceNodeDefs.Tree)
              )
            );
          }
        }
      });

      return actions;
    })
  );

// Mostly temporary, just here to generate a scenario which makes testing easy
export const generateMap$: Epic<Action, Action, RootState> = (actions$) =>
  actions$.pipe(
    filter(generateMap.match),
    mergeMap(() => {
      let actions: Action[] = [];

      const mapWidth = 20;
      const mapHeight = 20;
      const playerX = Math.floor(mapWidth / 2);
      const playerY = Math.floor(mapHeight / 2);
      const mapArea = generateMapArea(mapWidth, mapHeight);

      const item = ItemFactory(ItemDefs[ITEM_KEYS.Sand]);
      mapArea.items[fromXY(playerX, playerY, mapWidth)] = [item];

      // const enemy = EnemyFactory(EnemyDefs.Test.config);
      // mapArea.enemies[fromXY(playerX, playerY, mapWidth)] = [enemy];

      mapArea.spawns[fromXY(playerX, playerY, mapWidth)] = [getSpawnDefinition(SPAWN_KEYS.Test)];


      actions = actions.concat(
        // enemyCreated(enemy),
        mapAreaUpdated(mapArea),
        playerMoved(MapLocationFactory(mapArea.id, playerX, playerY))
      );

      Object.values(mapArea.towns).forEach((town) => {
        town.facilities
          .filter((f) => f.key === FACILITY_KEYS.Shop)
          .forEach((shop) => {
            const shopItem1 = ItemFactory(ItemDefs[ITEM_KEYS.WoodAxe]);
            shop.shopItems.push(shopItem1);
            const shopItem2 = ItemFactory(ItemDefs[ITEM_KEYS.Plant]);
            shop.shopItems.push(shopItem2);
          });
      });

      return actions;
    })
  );
