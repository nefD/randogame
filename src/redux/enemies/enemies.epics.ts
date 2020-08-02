import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { RootState } from 'app/rootReducer';
import {
  enemyWasAttacked,
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
import { combatCompleted, rollLootTables } from 'redux/combat/combat.actions';
import { removeEnemyFromMapCell } from 'redux/mapAreas/mapAreas.slice';
import {
  getCurrentMapId,
  getPlayerMapPos,
} from 'redux/character/character.selectors';
import { select } from 'utilities/redux.utilities';

export const enemyAttacked$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(enemyWasAttacked.match),
  map(({ payload: { enemy, damage } }) =>
    (Math.max(0, enemy.health - damage) <= 0)
      ? enemyKilled(enemy)
      : enemyUpdated({
        ...enemy,
        health: enemy.health - damage,
      }),
  ));

export const enemyKilled$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(enemyKilled.match),
  withLatestFrom(
    state$.pipe(select(getCurrentMapId)),
    state$.pipe(select(getPlayerMapPos)),
  ),
  mergeMap(([{ payload: enemy }, mapId, playerPos]) => {
    const actions: Action[] = [
      combatCompleted(),
      removeEnemyFromMapCell(mapId, playerPos.x, playerPos.y, enemy),
      enemyDeleted(enemy.id),
    ];
    if (enemy.lootTables.length) actions.push(rollLootTables(enemy.lootTables));
    return actions;
  }),
);
