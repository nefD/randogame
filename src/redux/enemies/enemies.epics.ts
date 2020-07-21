import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { RootState } from 'app/rootReducer';
import {
  enemyAttacked,
  enemyDeleted,
  enemyKilled,
  enemyUpdated,
} from 'redux/enemies/enemies.slice';
import {
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import { combatCompleted } from 'redux/combat/combat.actions';
import { removeEnemyFromMapCell } from 'redux/mapAreas/mapAreas.slice';
import {
  getCurrentMapId,
  getPlayerMapPos,
} from 'redux/character/character.selectors';
import { select } from 'utilities/redux.utilities';
import { rollLootTables } from 'redux/items/items.slice';

export const enemyAttacked$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(enemyAttacked.match),
  map((action) => {
    const health = Math.max(0, action.payload.enemy.health - action.payload.damage);
    if (health <= 0) {
      return enemyKilled(action.payload.enemy);
    }
    return enemyUpdated({
      ...action.payload.enemy,
      health: action.payload.enemy.health - action.payload.damage,
    });
  }),
);

export const enemyKilled$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(enemyKilled.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapId)),
    state$.pipe(select(getPlayerMapPos)),
  ),
  mergeMap(([action, mapId, playerPos]) => {
    const actions: Action[] = [
      combatCompleted(),
      removeEnemyFromMapCell(mapId, playerPos.x, playerPos.y, action.payload),
      enemyDeleted(action.payload.id),
    ];
    if (action.payload.lootTables.length) actions.push(rollLootTables(action.payload.lootTables));
    return actions;
  }),
);
