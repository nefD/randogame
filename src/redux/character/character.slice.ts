import { CHARACTER_RACE } from 'data/races.consts';
import { CHARACTER_CLASSES } from 'data/classes.consts';
import {
  createAction,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  Stats,
  StatsFactory,
} from 'data/commonTypes';
import { clamp } from 'utilities/math.utilities';
import { SkillKey } from 'data/skills.consts';
import {
  CharacterEquipment,
  CharacterEquipmentFactory,
  CharacterGameState,
  CharacterSkill,
  CharacterSkillFactory,
} from 'models/character';
import { MapLocation } from 'models/map';
import { Enemy } from 'models/enemy';
import { Item } from 'models/item';

export interface CombatState {
  enemy: string;
}

export interface CharacterState {
  name: string;
  race: CHARACTER_RACE;
  class: CHARACTER_CLASSES;
  level: number;
  xp: number;
  age: number;
  gold: number;
  skills: CharacterSkill[];
  stats: Stats;
  location: MapLocation;
  equipment: CharacterEquipment;
  inventory: string[];
  inventoryMax: number;
  gameState: CharacterGameState;
  combatState: CombatState;
}

const initialState: CharacterState = {
  name: 'Unknown',
  race: CHARACTER_RACE.Human,
  class: CHARACTER_CLASSES.Warrior,
  level: 1,
  xp: 0,
  age: 0,
  gold: 100,
  skills: [],
  stats: StatsFactory({
    health: 10, healthMax: 10,
    hunger: 100, hungerMax: 100,
    mana: 10, manaMax: 10,
    attack: 4,
    defense: 4,
  }),
  location: {
    mapId: '',
    coords: { x: 0, y: 0 },
    facilityId: null,
  },
  equipment: CharacterEquipmentFactory(),
  inventory: [],
  inventoryMax: 15,
  gameState: CharacterGameState.Travel,
  combatState: {
    enemy: '',
  },
};

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    createCharacter(state, action: PayloadAction<Partial<CharacterState>>) {
      state = { ...state, ...action.payload };
    },
    playerMoved(state, action: PayloadAction<MapLocation>) {
      state.age += 1;
      state.location = { ...action.payload };
    },
    inventoryAdded(state, action: PayloadAction<Item>) {
      state.inventory.push(action.payload.id);
    },
    removeFromInventory(state, action: PayloadAction<Item>) {
      state.inventory = state.inventory.filter(i => i !== action.payload.id);
    },
    playerStartCombat(state, action: PayloadAction<Enemy>) {
      state.gameState = CharacterGameState.Combat;
      state.combatState.enemy = action.payload.id;
      state.age += 1;
    },
    playerExitCombat(state, action: PayloadAction) {
      state.gameState = CharacterGameState.Travel;
    },
    playerTakingDamage(state, action: PayloadAction<number>) {
      state.stats.health = Math.max(0, state.stats.health - action.payload);
    },
    playerHealthModified(state, action: PayloadAction<number>) {
      state.stats.health = clamp(state.stats.health + action.payload, 0, state.stats.healthMax);
    },
    playerHungerModified(state, action: PayloadAction<number>) {
      state.stats.hunger = clamp(state.stats.hunger + action.payload, 0, state.stats.hungerMax);
    },
    playerGoldModified(state, action: PayloadAction<number>) {
      state.gold = Math.max(state.gold + action.payload, 0);
    },
    playerManaModified(state, action: PayloadAction<number>) {
      state.stats.mana = clamp(state.stats.mana + action.payload, 0, state.stats.manaMax);
    },
    playerEnteringFacility(state, action: PayloadAction<string>) {
      state.location.facilityId = action.payload;
      state.gameState = CharacterGameState.Facility;
    },
    playerLeavingFacility(state, action: PayloadAction) {
      state.location.facilityId = null;
      state.gameState = CharacterGameState.Travel;
    },
    addSkillPoints: {
      reducer(state, { payload: { skillKey, points } }: PayloadAction<{ skillKey: SkillKey, points: number }>) {
        let playerSkill = state.skills.find(s => s.skillKey === skillKey);
        if (!playerSkill) {
          playerSkill = CharacterSkillFactory({
            skillKey: skillKey,
          });
          state.skills.push(playerSkill);
        }
        playerSkill.points += points;
      },
      prepare(skillKey: SkillKey, points: number) {
        return { payload: { skillKey, points } };
      },
    },
    updateSkill(state, { payload: skill }: PayloadAction<CharacterSkill>) {
      let playerSkill = state.skills.find(s => s.skillKey === skill.skillKey);
      if (!playerSkill) {
        playerSkill = CharacterSkillFactory(skill);
        state.skills.push(playerSkill);
        return;
      }
      Object.assign(playerSkill, skill);
    },
    updateEquipment(state, { payload: updatedEquipment }: PayloadAction<Partial<CharacterEquipment>>) {
      state.equipment = {
        ...state.equipment,
        ...updatedEquipment,
      };
    }
  },
});

export const createCharacter = characterSlice.actions.createCharacter;
export const playerMoved = characterSlice.actions.playerMoved;
export const inventoryAdded = characterSlice.actions.inventoryAdded;
export const removeFromInventory = characterSlice.actions.removeFromInventory;
export const playerStartCombat = characterSlice.actions.playerStartCombat;
export const playerExitCombat = characterSlice.actions.playerExitCombat;
export const playerTakingDamage = characterSlice.actions.playerTakingDamage;
export const playerHungerModified = characterSlice.actions.playerHungerModified;
export const playerEnteringFacility = characterSlice.actions.playerEnteringFacility;
export const playerLeavingFacility = characterSlice.actions.playerLeavingFacility;
export const playerHealthModified = characterSlice.actions.playerHealthModified;
export const playerGoldModified = characterSlice.actions.playerGoldModified;
export const playerManaModified = characterSlice.actions.playerManaModified;
export const addSkillPoints = characterSlice.actions.addSkillPoints;
export const updateSkill = characterSlice.actions.updateSkill;
export const updateEquipment = characterSlice.actions.updateEquipment;

export const playerMovingNorth = createAction('character/movingNorth');
export const playerMovingEast = createAction('character/movingEast');
export const playerMovingSouth = createAction('character/movingSouth');
export const playerMovingWest = createAction('character/movingWest');
export const pickUpItemFromCurrentMapCell = createAction<Item>('character/pickUpItemFromCurrentMapCell');
export const addToInventory = createAction<Item>('character/addToInventory');
export const dropItemFromInventory = createAction<Item>('character/dropItemFromInventory');
export const playerAttacked = createAction(
  'character/playerAttacked',
  (enemy: Enemy, damage: number) => ({ payload: { enemy, damage }}),
);
export const playerUsedInn = createAction('character/playerUsedInn');
export const playerUsedTavern = createAction('character/playerUsedTavern');
export const buyItemFromShop = createAction<Item>('character/buyItemFromShop');
export const sellItemToShop = createAction<Item>('character/sellItemToShop');
export const harvestResourceNode = createAction<string>('character/harvestResourceNode');
export const playerSkillIncreased = createAction(
  'character/skillIncreased',
  (skillKey: SkillKey, points: number) => ({ payload: { skillKey, points }}),
);
export const playerEquippedItem = createAction<Item>('character/playerEquippedItem');
export const playerUnequippedItem = createAction<Item>('character/playerUnequippedItem');

export default characterSlice.reducer;
