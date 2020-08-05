export enum ITEM_KEYS {
  Dagger = 'Dagger',
  Empty = 'Empty',
  Hat = 'Hat',
  HealingPotion = 'HealingPotion',
  Plant = 'Plant',
  Sand = 'Sand',
  Stick = 'Stick',
  TestItem = 'TestItem',
  Wood = 'Wood',
  WoodAxe = 'WoodAxe',
  TomeTesting = 'TomeTesting',
}

export type ItemKey = keyof typeof ITEM_KEYS;
