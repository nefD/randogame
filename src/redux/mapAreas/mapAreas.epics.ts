import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { RootState } from 'app/rootReducer';
import {
  addItemToMapCell,
  addResourceNodeToMapCell,
  generateMap,
  mapAreaUpdated,
  spawnMapCell,
} from './mapAreas.slice';
import {
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  fromXY,
  MapLocationFactory,
} from 'utilities/mapAreas.utilities';
import { ItemFactory } from 'utilities/item.utilities';
import {
  ITEM_KEYS,
  ItemDefs,
} from 'data/item.consts';
import { itemCreated } from 'redux/items/items.slice';
import { playerMoved } from '../character/character.slice';
import { EnemyFactory } from 'utilities/enemy.utilities';
import { EnemyDefs } from 'data/enemies.consts';
import { enemyCreated } from '../enemies/enemies.slice';
import {
  AreaCellResourceDefs,
  FACILITY_TYPE,
} from 'data/areas.consts';
import { generateMapArea } from 'utilities/mapGeneration.utilities';
import {
  NullAction,
  select,
} from 'utilities/redux.utilities';
import {
  getCurrentMapArea,
  getItemsAtPlayerPos,
  getResourceNodesAtPlayerPos,
} from 'redux/mapAreas/mapAreas.selectors';
import { getPlayerMapLocation } from 'redux/character/character.selectors';
import {
  NODE_KEYS,
  ResourceNodeDefs,
} from 'data/resources.consts';
import { rng } from 'utilities/random.utilities';
import { ResourceNodeFactory } from 'utilities/resources.utilities';

export const playerMoved$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(playerMoved.match),
  map((action) => spawnMapCell()),
);

export const spawnMapCell$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(spawnMapCell.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapArea)),
    state$.pipe(select(getPlayerMapLocation)),
    state$.pipe(select(getItemsAtPlayerPos)),
    state$.pipe(select(getResourceNodesAtPlayerPos)),
  ),
  mergeMap(([action, mapArea, playerLoc, cellItems, resourceNodes]) => {
    const actions: Action[] = [];
    const cellType = mapArea?.cellTypes[fromXY(playerLoc.coords.x, playerLoc.coords.y, mapArea.width)];
    if (mapArea && cellType) {
      const resourceDefs = AreaCellResourceDefs[cellType] || [];
      resourceDefs.forEach(resourceDef => {

        if (resourceDef.itemKey) {
          if (cellItems.filter(i => i.key === resourceDef.itemKey).length > resourceDef.max) return;
          if (rng(100) < resourceDef.chance) {
            const item = ItemFactory(ItemDefs[resourceDef.itemKey]);
            actions.push(itemCreated(item));
            actions.push(addItemToMapCell(mapArea.id, playerLoc.coords.x, playerLoc.coords.y, item));
          }
        }

        if (resourceDef.nodeKey) {
          if (resourceNodes.filter(n => n.key === resourceDef.nodeKey).length >= resourceDef.max) return;
          if (rng(100) < resourceDef.chance) {
            const node = ResourceNodeFactory(ResourceNodeDefs.Tree);
            actions.push(addResourceNodeToMapCell(mapArea.id, playerLoc.coords.x, playerLoc.coords.y, node));
          }
        }
      });
    }
    return actions;
  }),
)

export const generateMap$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(generateMap.match),
  mergeMap(() => {
    let actions: Action[] = [];

    const mapWidth = 10;
    const mapHeight = 10;
    const playerX = Math.floor(mapWidth / 2);
    const playerY = Math.floor(mapHeight / 2);
    const mapArea = generateMapArea(mapWidth, mapHeight);

    const item = ItemFactory(ItemDefs[ITEM_KEYS.Sand]);
    mapArea.items[fromXY(playerX, playerY, mapWidth)] = [item.id];
    const enemy = EnemyFactory(EnemyDefs.TestEnemy.config);
    mapArea.enemies[fromXY(playerX, playerY, mapWidth)] = [enemy.id];

    actions = actions.concat(
      itemCreated(item),
      enemyCreated(enemy),
      mapAreaUpdated(mapArea),
      // areaCellsAdded(cells),

      playerMoved(MapLocationFactory(mapArea.id, playerX, playerY)),
    );

    Object.values(mapArea.towns).forEach(town => {
      town.facilities.filter(f => f.type === FACILITY_TYPE.Shop).forEach(shop => {
        const shopItem1 = ItemFactory(ItemDefs[ITEM_KEYS.WoodAxe]);
        shop.shopItems.push(shopItem1.id);
        actions.push(itemCreated(shopItem1));
        const shopItem2 = ItemFactory(ItemDefs[ITEM_KEYS.Plant]);
        shop.shopItems.push(shopItem2.id);
        actions.push(itemCreated(shopItem2));
      });
    });

    return actions;
  }),
);


