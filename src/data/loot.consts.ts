import { ITEM_KEYS, ItemKey } from "data/items.keys";

export interface ILootItem {
  itemDef: ItemKey;
  chance: number;
}

export interface ILootTable {
  items: ILootItem[];
}

type TLootTables = { [key: string]: ILootTable };

const testingLootTable: ILootTable = {
  items: [
    { itemDef: ITEM_KEYS.TestItem, chance: 60 },
    { itemDef: ITEM_KEYS.TestItem, chance: 60 },
  ],
};

export const LootTables = {
  testing: testingLootTable
};

export type LootTableKey = keyof typeof LootTables;
