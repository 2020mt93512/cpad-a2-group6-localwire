const getItem = (key: string): string | null => window.localStorage.getItem(key);

const setItem = (key: string, value: string): void => window.localStorage.setItem(key, value);

const removeItem = (key: string): void => window.localStorage.removeItem(key);

const storageService = { getItem, setItem, removeItem };

export default storageService;
