import { createAction } from '@reduxjs/toolkit';

export const combatPlayerAttacking = createAction('combat/playerAttacking');
export const combatPlayerFleeing = createAction('combat/playerFleeing');
export const combatCompleted = createAction('combat/completed');
export const combatEnemyAttacking = createAction('combat/enemyAttacking');
