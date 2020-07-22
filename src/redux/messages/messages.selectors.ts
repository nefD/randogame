import { createSelector } from 'reselect';
import { getMessagesState } from 'app/baseSelectors';

export const getMessages = createSelector(
  getMessagesState,
  state => state.messages,
);
