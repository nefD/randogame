export const keysFromEnum = (e: any): String[] => Object.keys(e).filter(v => isNaN(Number(v)));
