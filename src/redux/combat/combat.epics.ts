import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { RootState } from 'app/rootReducer';
import {
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  combatCompleted,
  combatEnemyAttacking,
  combatPlayerAttacking,
  combatPlayerFleeing,
} from 'redux/combat/combat.actions';
import {
  playerAttacked,
  playerExitCombat,
} from 'redux/character/character.slice';
import {
  getCharacterObject,
  getPlayerCombatEnemy,
} from 'redux/character/character.selectors';
import { enemyAttacked } from 'redux/enemies/enemies.slice';
import {
  select,
} from 'utilities/redux.utilities';

export const combatPlayerFleeing$: Epic<Action, Action, RootState> = (actions$) => actions$.pipe(
  filter(combatPlayerFleeing.match),
  map(() => playerExitCombat()),
);

export const combatCompleted$: Epic<Action, Action, RootState> = (actions$) => actions$.pipe(
  filter(combatCompleted.match),
  map(() => playerExitCombat()),
);

export const combatPlayerAttacking$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(combatPlayerAttacking.match),
  withLatestFrom(
    state$.pipe(select(getPlayerCombatEnemy))
  ),
  filter(([, enemy]) => !!enemy),
  mergeMap(([, enemy]) => [
    enemyAttacked(enemy!, 2),
    combatEnemyAttacking(),
  ]),
);

export const combatEnemyAttacking$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(combatEnemyAttacking.match),
  withLatestFrom(
    state$.pipe(select(getPlayerCombatEnemy))
  ),
  filter(([,enemy]) => !!enemy && enemy.health > 0),
  map(([, enemy]) => playerAttacked(enemy!, 1)),
);
