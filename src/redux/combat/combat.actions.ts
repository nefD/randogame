import { createAction } from '@reduxjs/toolkit';
import { AbilityKey } from "data/abilities.consts";
import { LootTableKey } from "data/loot.consts";

export const combatPlayerAttacking = createAction('combat/playerAttacking');
export const combatPlayerFleeing = createAction('combat/playerFleeing');
export const combatCompleted = createAction('combat/completed');
export const combatEnemyAttacking = createAction('combat/enemyAttacking');
export const combatUseAbility = createAction<AbilityKey>('combat/combatUseAbility');
export const rollLootTables = createAction<LootTableKey[]>('combat/rollLootTables');
