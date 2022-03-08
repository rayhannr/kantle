import { getFromStorage, isInClient, setToStorage } from "./dom";

const gameStateKey = "gameState";
const highContrastKey = "highContrast";

type StoredGameState = {
  guesses: string[];
  solution: string;
};

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  isInClient() && localStorage.setItem(gameStateKey, JSON.stringify(gameState));
};

export const loadGameStateFromLocalStorage = () => {
  const state = getFromStorage(gameStateKey);
  return state ? (JSON.parse(state) as StoredGameState) : null;
};

const gameStatKey = "gameStats";

export type GameStats = {
  winDistribution: number[];
  gamesFailed: number;
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  successRate: number;
};

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  setToStorage(gameStatKey, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = getFromStorage(gameStatKey);
  return stats ? (JSON.parse(stats) as GameStats) : null;
};

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    setToStorage(highContrastKey, "1");
  } else {
    localStorage.removeItem(highContrastKey);
  }
};

export const getStoredIsHighContrastMode = () => {
  const highContrast = getFromStorage(highContrastKey);
  return highContrast === "1";
};
