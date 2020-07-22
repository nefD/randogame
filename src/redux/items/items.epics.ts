import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { RootState } from 'app/rootReducer';
import {
  filter,
  mergeMap,
} from 'rxjs/operators';
import {
  itemCreated,
  rollLootTables,
} from 'redux/items/items.slice';
import { LootTables } from 'data/loot.consts';
import { rng } from 'utilities/random.utilities';
import { ItemFactory } from 'utilities/item.utilities';
import { ItemDefs } from 'data/item.consts';
import {
  addToInventory,
} from 'redux/character/character.slice';

export const rollLootTables$: Epic<Action, Action, RootState> = (actions$, state$) => actions$.pipe(
  filter(rollLootTables.match),
  mergeMap((action) => {
    const actions: Action[] = [];

    action.payload.forEach(key => {
      LootTables[key].items.forEach(lootItem => {
        if (rng(100) <= lootItem.chance) {
          const item = ItemFactory(ItemDefs[lootItem.itemDef]);
          actions.push(itemCreated(item));
          actions.push(addToInventory(item));
        }
      });
    });
    return actions;
  }),
);
