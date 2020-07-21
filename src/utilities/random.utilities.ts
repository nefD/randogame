import { v4 as uuidv4 } from 'uuid';

export const uuid = uuidv4;

/**
 * Returns a random number between 0 and outOf (non-inclusive)
 * @param outOf
 */
export const rng = (outOf = 1) => Math.floor(Math.random() * outOf);

export const randomKeyFromObj = (obj: Object) => {
  const keys = Object.keys(obj);
  return keys[Math.floor(rng(keys.length))];
};

export const randomFromArray = <T>(arr: any[]): T => arr[Math.floor(rng(arr.length))];

export const shuffleArray = (arr: any[]) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(rng(i));
    const temp = newArr[i];
    newArr[i] = newArr[j];
    newArr[j] = temp;
  }
  return newArr;
};
