import { RootState } from 'app/rootReducer';

export const getEnemiesState = (state: RootState) => state.enemies;
export const getCharacter = (state: RootState) => state.character;
export const getMapAreasState = (state: RootState) => state.mapAreas;
