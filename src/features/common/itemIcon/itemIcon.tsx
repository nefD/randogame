import React from 'react';
import { Item } from 'redux/items/items.slice';
import { ItemDefs } from 'data/item.consts';
import './itemIcon.scss';

type ItemIconProps = {
  item: Item;
}

export function ItemIcon({ item }: ItemIconProps) {
  const path = ItemDefs[item.key].iconPath;
  if (!path) return (<div className="itemIcon"></div>);
  return (
    <div className="itemIcon">
      <img src={path} alt={item.name} />
    </div>
  );
}
