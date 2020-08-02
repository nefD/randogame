import { Action } from "redux";
import { Epic } from "redux-observable";
import { RootState } from "app/rootReducer";
import {
  addItemsToMapCell,
  addResourceNodeToMapCell,
  generateMap,
  mapAreaUpdated,
  spawnMapCell,
} from "./mapAreas.slice";
import { filter, map, mergeMap, withLatestFrom } from "rxjs/operators";
import { fromXY } from "utilities/mapAreas.utilities";
import { ItemDefs } from "data/item.consts";
import { playerMoved } from "../character/character.slice";
import { EnemyDefs } from "data/enemies.consts";
import { enemyCreated } from "../enemies/enemies.slice";
import { AreaCellResourceDefs, FACILITY_TYPE } from "data/areas.consts";
import { generateMapArea } from "utilities/mapGeneration.utilities";
import { NullAction, select } from "utilities/redux.utilities";
import {
  getCurrentMapArea,
  getItemsAtPlayerPos,
  getResourceNodesAtPlayerPos,
} from "redux/mapAreas/mapAreas.selectors";
import { getPlayerMapLocation } from "redux/character/character.selectors";
import { NODE_KEYS, ResourceNodeDefs } from "data/resources.consts";
import { rng } from "utilities/random.utilities";
import { ResourceNodeFactory } from "utilities/resources.utilities";
import { MapLocationFactory } from "models/map";
import { EnemyFactory } from "models/enemy";
import { ItemFactory } from "models/item";
import { ITEM_KEYS } from "data/item.keys";

export const playerMoved$: Epic<Action, Action, RootState> = (
  actions$,
  state$
) =>
  actions$.pipe(
    filter(playerMoved.match),
    map(() => spawnMapCell())
  );

export const spawnMapCell$: Epic<Action, Action, RootState> = (
  actions$,
  state$
) =>
  actions$.pipe(
    filter(spawnMapCell.match),
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
      const enemy = EnemyFactory(EnemyDefs.TestEnemy.config);
      mapArea.enemies[fromXY(playerX, playerY, mapWidth)] = [enemy.id];

      actions = actions.concat(
        enemyCreated(enemy),
        mapAreaUpdated(mapArea),
        playerMoved(MapLocationFactory(mapArea.id, playerX, playerY))
      );

      Object.values(mapArea.towns).forEach((town) => {
        town.facilities
          .filter((f) => f.type === FACILITY_TYPE.Shop)
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
