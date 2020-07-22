import { RootState } from 'app/rootReducer';

export const getEnemiesState = (state: RootState) => state.enemies;
export const getCharacter = (state: RootState) => state.character;
export const getItemsState = (state: RootState) => state.items;
export const getMapAreasState = (state: RootState) => state.mapAreas;
export const getMessagesState = (state: RootState) => state.messages;
