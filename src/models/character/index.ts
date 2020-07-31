import {Item} from 'models/item';

export enum CharacterGameState {
  Travel,
  Combat,
  Facility,
}

export enum EquipmentSlots {
  Head = 'Head',
  Body = 'Body',
  Feet = 'Feet',
  Weapon = 'Weapon',
  Shield = 'Shield',
}
export type EquipSlotKey = keyof typeof EquipmentSlots;

export type CharacterEquipment = {
  [key in EquipSlotKey]: string | null;
}

export type CharacterEquipmentItems = {
  [key in EquipSlotKey]: Item | null;
}

export const CharacterEquipmentFactory = (config?: Partial<CharacterEquipment>): CharacterEquipment => ({
  [EquipmentSlots.Head]: null,
  [EquipmentSlots.Body]: null,
  [EquipmentSlots.Feet]: null,
  [EquipmentSlots.Weapon]: null,
  [EquipmentSlots.Shield]: null,
  ...config,
});

export const CharacterEquipmentItemsFactory = (config?: Partial<CharacterEquipmentItems>): CharacterEquipmentItems => ({
  [EquipmentSlots.Head]: null,
  [EquipmentSlots.Body]: null,
  [EquipmentSlots.Feet]: null,
  [EquipmentSlots.Weapon]: null,
  [EquipmentSlots.Shield]: null,
  ...config,
});

