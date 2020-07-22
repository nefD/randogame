import {
  CharacterEquipment,
  CharacterEquipmentItems,
  EquipmentSlots,
} from 'redux/character/character.slice';

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
