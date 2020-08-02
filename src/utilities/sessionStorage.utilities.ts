export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = window.localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) as T : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const setLocalStorageItem = <T>(key: string, value: T) => {
  console.log(`setting session item ${key}:`, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    console.log(`set storage item.. it is now:`, getLocalStorageItem(key, []));
    return true;
  } catch (error) {
    return false;
  }
}
