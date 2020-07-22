import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface Message {
  content: string;
  timestamp?: string;
}

export interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push({
        timestamp: new Date().toLocaleTimeString(),
        ...action.payload
      });
    },
    clearMessages(state, action: PayloadAction) {
      state.messages = [];
    },
  },
});

export const addMessage = messagesSlice.actions.addMessage;
export const clearMessages = messagesSlice.actions.clearMessages;

export default messagesSlice.reducer;
