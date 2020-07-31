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
  combatUseAbility,
} from 'redux/combat/combat.actions';
import {
  playerAttacked,
  playerExitCombat,
} from 'redux/character/character.slice';
import {
  getCharacterObject, getPlayerAbilities,
  getPlayerCombatEnemy, getPlayerEquipment, getPlayerSkills, getPlayerStats, getPlayerWeapon,
} from 'redux/character/character.selectors';
import { enemyAttacked } from 'redux/enemies/enemies.slice';
import {
  NullAction,
  select,
} from 'utilities/redux.utilities';
import { AbilityDefs, AbilityKey } from "data/abilities.consts";
import { CharacterSkill } from "models/character/skill";
import { log } from "util";

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

export const combatUseAbility$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(combatUseAbility.match),
  withLatestFrom(
    state$.pipe(select(getPlayerAbilities)),
    state$.pipe(select(getPlayerStats)),
    state$.pipe(select(getPlayerSkills)),
    state$.pipe(select(getPlayerWeapon)),
    state$.pipe(select(getPlayerCombatEnemy)),
  ),
  filter(([action, playerAbilities,,,,enemy]) => playerAbilities.includes(action.payload) && !!enemy),
  mergeMap(([
    { payload: abilityKey },
    playerAbilities,
    playerStats,
    playerSkills,
    weapon,
    enemy
  ]) => {
    console.log(`combatUseAbility$`);
    const actions: Action[] = [];
    const ability = AbilityDefs[abilityKey];
    const relatedSkill = playerSkills.find(s => s.skillKey === ability.skillKey);

    if (ability.weaponRequired && (!weapon || weapon.equipProps!.skillKey !== ability.skillKey)) {
      return [NullAction(`ability requires weapon of skill ${ability.skillKey}`)];
    }

    if (ability.damageProps) {
      let damage = 0;
      let baseDamage = 0;
      let skillMultiDamage = 0;
      let weaponMultiDamage = 0;

      // damage += ability.damageProps.baseDamage || 0;
      console.log(`base damage: ${baseDamage}`);

      if (ability.damageProps.skillMultiDamage && relatedSkill) {
        skillMultiDamage = relatedSkill.level * ability.damageProps.skillMultiDamage;
        console.log(`skill multiplier damage: ${skillMultiDamage}`);
      }

      if (ability.damageProps.weaponMultiDamage && weapon) {
        weaponMultiDamage = (weapon.equipProps!.damage || 0) * ability.damageProps.weaponMultiDamage;
        console.log(`weapon multiplier damage: ${weaponMultiDamage}`);
      }

      damage += baseDamage + skillMultiDamage + weaponMultiDamage;
      console.log(`final damage: ${damage}`);

      actions.push(enemyAttacked(enemy!, damage));
    }

    return actions.concat(combatEnemyAttacking());
  }),
);
