import { Action } from 'redux';
import { Epic } from 'redux-observable';
import { RootState } from 'app/rootReducer';
import {
  generateMap,
  mapAreaUpdated,
} from './mapAreas.slice';
import {
  filter,
  mergeMap,
} from 'rxjs/operators';
import {
  fromXY,
  generateMapArea,
  MapLocationFactory,
} from 'utilities/mapAreas.utilities';
import { ItemFactory } from 'utilities/item.utilities';
import { ItemDefs } from 'data/item.consts';
import { itemCreated } from 'redux/items/items.slice';
import { areaCellsAdded } from 'redux/areaCells/areaCells.slice';
import { playerMoved } from '../character/character.slice';
import { EnemyFactory } from 'utilities/enemy.utilities';
import { EnemyDefs } from 'data/enemies.consts';
import { enemyCreated } from '../enemies/enemies.slice';

export const generateMap$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(generateMap.match),
  mergeMap(() => {
    const mapWidth = 20;
    const mapHeight = 20;
    const playerX = Math.floor(mapWidth / 2);
    const playerY = Math.floor(mapHeight / 2);
    const mapArea = generateMapArea(mapWidth, mapHeight);

    const item = ItemFactory(ItemDefs.TestItem);
    mapArea.items[fromXY(playerX, playerY, mapWidth)] = [item.id];
    const enemy = EnemyFactory(EnemyDefs.TestEnemy.config);
    mapArea.enemies[fromXY(playerX, playerY, mapWidth)] = [enemy.id];

    return [
      itemCreated(item),
      enemyCreated(enemy),
      mapAreaUpdated(mapArea),
      // areaCellsAdded(cells),

      playerMoved(MapLocationFactory(mapArea.id, playerX, playerY)),
    ];
  }),
);


