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
import {LootTableKey, LootTables} from 'data/loot.consts';
import { rng } from 'utilities/random.utilities';
import { ItemDefs } from 'data/item.consts';
import {
  addToInventory,
} from 'redux/character/character.slice';
import { ItemFactory } from 'models/item';

export const rollLootTables$: Epic<Action, Action, RootState> = (actions$) => actions$.pipe(
  filter(rollLootTables.match),
  mergeMap(({ payload: lootTableKeys }) => lootTableKeys.reduce((actions: Action[], tableKey: LootTableKey) => {
    LootTables[tableKey].items.forEach(lootItem => {
      if (rng(100) <= lootItem.chance) {
        const item = ItemFactory(ItemDefs[lootItem.itemDef]);
        actions.push(
          itemCreated(item),
          addToInventory(item)
        );
      }
    });
    return actions;
  }, [])),
);
