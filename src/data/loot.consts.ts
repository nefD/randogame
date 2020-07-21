import { ItemKey } from 'data/item.consts';

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
    { itemDef: 'TestItem', chance: 60 },
    { itemDef: 'TestItem', chance: 60 },
    { itemDef: 'TestItem', chance: 60 },
    { itemDef: 'TestItem', chance: 60 },
  ]
};

export const LootTables = {
  testing: testingLootTable
};

export type LootTableKey = keyof typeof LootTables;
