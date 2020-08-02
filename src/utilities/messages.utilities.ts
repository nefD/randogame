import { writeStorage } from "@rehooks/local-storage";
import { Message } from "models/messages";

export const MAX_GAME_MESSAGES = 50;

export const gameMessageFactory = (content: string): Message => ({
  content,
  timestamp: new Date().toLocaleTimeString(),
});

export const addGameMessage = (content: string) => {
  const message = gameMessageFactory(content);
  let list: Message[];
  try {
    const val = window.localStorage.getItem('gameMessages');
    console.log(`VAL: ${val}`);
    list = val ? JSON.parse(val) : [];
  } catch (error) {
    list = [];
  }
  list.push(message);
  if (list.length > MAX_GAME_MESSAGES) {
    list.shift();
  }
  writeStorage('gameMessages', list);
};

export const clearGameMessages = () => {
  writeStorage('gameMessages', []);
};
