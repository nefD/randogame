import { enemiesAdapter } from './enemies.slice';
import { createSelector } from 'reselect';
import { getPlayerCombatState } from '../character/character.selectors';
import { getEnemiesState } from 'app/baseSelectors';

export const enemiesSelectors = enemiesAdapter.getSelectors();

