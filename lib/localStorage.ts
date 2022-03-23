import {
  GAME_MODE_KEY,
  GAME_NAME,
  GAME_STATE_KEY,
  GAME_STAT_KEY,
  HIGH_CONSTRAST_KEY,
  THEME_KEY,
} from "../constants/strings";
import { isInClient } from "./dom";

const removeGameNameFromKey = (key: string) => key.replace(`${GAME_NAME.toLowerCase()}:`, "");

export const getFromStorage = (key: string) => {
  if (!isInClient()) return "";

  return localStorage.getItem(key) || localStorage.getItem(removeGameNameFromKey(key));
};

export const setToStorage = (key: string, value: string) => {
  if (!isInClient()) return;
  localStorage.setItem(key, value);
  localStorage.removeItem(removeGameNameFromKey(key));
};

export const removeFromStorage = (key: string) => {
  if (!isInClient()) return;
  localStorage.removeItem(key);
  localStorage.removeItem(removeGameNameFromKey(key));
};

export const clearLocalStorage = () => {
  if (!isInClient()) return;
  localStorage.clear();
};

type StoredGameState = {
  guesses: string[];
  solution: string;
};

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  setToStorage(GAME_STATE_KEY, JSON.stringify(gameState));
};

export const loadGameStateFromLocalStorage = () => {
  const state = getFromStorage(GAME_STATE_KEY);
  return state ? (JSON.parse(state) as StoredGameState) : null;
};

export type GameStats = {
  winDistribution: number[];
  gamesFailed: number;
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  successRate: number;
  lastSolutionIndex: number;
};

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  setToStorage(GAME_STAT_KEY, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = getFromStorage(GAME_STAT_KEY);
  return stats ? (JSON.parse(stats) as GameStats) : null;
};

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    setToStorage(HIGH_CONSTRAST_KEY, "1");
  } else {
    removeFromStorage(HIGH_CONSTRAST_KEY);
  }
};

export const getStoredIsHighContrastMode = () => {
  const highContrast = getFromStorage(HIGH_CONSTRAST_KEY);
  return highContrast === "1";
};
