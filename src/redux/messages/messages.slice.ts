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
  maxMessages: number;
}

const initialState: MessagesState = {
  messages: [],
  maxMessages: 20,
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
      if (state.messages.length > state.maxMessages) {
        state.messages.shift();
      }
    },
    clearMessages(state, action: PayloadAction) {
      state.messages = [];
    },
  },
});

export const addMessage = messagesSlice.actions.addMessage;
export const clearMessages = messagesSlice.actions.clearMessages;

export default messagesSlice.reducer;
