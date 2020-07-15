import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { RootState } from 'app/rootReducer';
import {
  enemyAttacked,
  enemyKilled,
  enemyUpdated,
} from 'redux/enemies/enemies.slice';
import {
  filter,
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

export const enemyAttacked$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(enemyAttacked.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapId)),
    state$.pipe(select(getPlayerMapPos)),
  ),
  mergeMap(([action, mapId, playerPos]) => {
    const health = Math.max(0, action.payload.enemy.health - action.payload.damage);
    let actions: Action[] = [enemyUpdated({
      ...action.payload.enemy,
      health: action.payload.enemy.health - action.payload.damage,
    })];
    if (health <= 0) {
      actions = [
        combatCompleted(),
        removeEnemyFromMapCell(mapId, playerPos.x, playerPos.y, action.payload.enemy),
        enemyKilled(action.payload.enemy.id),
      ];
    }
    return actions;
  }),
);
