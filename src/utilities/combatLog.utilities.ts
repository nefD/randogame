let messages: string[] = [];

export const addCombatLog = (message: string) => messages.push(message);

export const clearCombatLog = () => messages = [];

export const getCombatLog = () => messages;
