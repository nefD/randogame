export const ItemDefs = {
  Empty: {
    key: 'Empty',
    name: 'Empty Item',
  },
  TestItem: {
    key: 'TestItem',
    name: 'Test Item',
  },
  Sand: {
    key: 'Sand',
    name: 'Sand',
  },
  Stick: {
    key: 'Stick',
    name: 'Stick',
  },
  Plant: {
    key: 'Plant',
    name: 'Plant',
  },
};

export type ItemKey = keyof typeof ItemDefs;

export const ItemIcons: Record<string, string> = {
  Sand: 'sand.svg',
  Stick: 'wood-stick.svg',
  Plant: 'zigzag-leaf.svg',
};


