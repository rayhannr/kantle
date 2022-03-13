export const GAME_NAME = process.env.REACT_APP_GAME_NAME!;
export const GAME_DOMAIN = process.env.REACT_APP_BASE_URL!.replace("https://", "");

export const WIN_MESSAGES = [
  "Gokil!",
  "Mantap",
  "Wedeeeeeh",
  "Wadidaw",
  "Sakti",
  "Ampun bang jago",
  "Hebat anda! Anak siapa anda?!",
];
export const GAME_COPIED_MESSAGE = "Disalin ke clipboard";
export const NOT_ENOUGH_LETTERS_MESSAGE = "Hurufnya kurang tuh";
export const WORD_NOT_FOUND_MESSAGE = "Kata tidak ditemukan";
export const HARD_MODE_ALERT_MESSAGE = "Mode susah hanya bisa diganti di awal permainan!";
export const HARD_MODE_DESCRIPTION = "Setiap petunjuk dari jawaban sebelumnya harus digunakan";
export const HIGH_CONTRAST_MODE_DESCRIPTION = "Untuk penglihatan warna yang lebih baik";
export const CORRECT_WORD_MESSAGE = (solution: string) => `Jawabannya ${solution}`;
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) => `${guess} harus dipakai di kotak ke-${position}`;
export const NOT_CONTAINED_MESSAGE = (letter: string) => `Tebakan harus punya huruf ${letter}`;
export const ENTER_TEXT = "Enter";
export const STATISTICS_TITLE = "Statistik";
export const GUESS_DISTRIBUTION_TEXT = "Distribusi Tebakan";
export const NEW_WORD_TEXT = "Kata berikutnya";
export const SHARE_TEXT = "Share";
export const IMAGE_TEXT = "Image";
export const IMAGE_CHECKBOX_TEXT = "Sertakan jawaban pada gambar";
export const TWEET_TEXT = "Tweet";
export const TOTAL_TRIES_TEXT = "Dimainkan";
export const SUCCESS_RATE_TEXT = "Menang";
export const CURRENT_STREAK_TEXT = "Runtutan sekarang";
export const BEST_STREAK_TEXT = "Runtutan tertinggi";
export const SOLUTION_PASSPHRASE = process.env.REACT_APP_SOLUTION_PASSPHRASE || "";
export const GAME_TITLE = "Kantle - Permainan Tebak Kata 6 Huruf";
export const GAME_DESCRIPTION =
  "Tebak kata Bahasa Indonesia dalam 6 kali percobaan. Selalu ada kata baru setiap harinya.";

const setLocalStorageKeyName = (key: string) => `${GAME_NAME.toLowerCase()}:${key}`;
export const GAME_STAT_KEY = setLocalStorageKeyName("gameStats");
export const GAME_STATE_KEY = setLocalStorageKeyName("gameState");
export const THEME_KEY = setLocalStorageKeyName("theme");
export const GAME_MODE_KEY = setLocalStorageKeyName("gameMode");
export const HIGH_CONSTRAST_KEY = setLocalStorageKeyName("highContrast");
export const SOLUTION_MEANING_KEY = setLocalStorageKeyName("solutionMeaning");
