export const isInClient = () => typeof window !== "undefined";

export const getFromStorage = (key: string) => {
  return isInClient() ? localStorage.getItem(key) : "";
};

export const setToStorage = (key: string, value: string) => {
  if (isInClient()) {
    localStorage.setItem(key, value);
  }
};
