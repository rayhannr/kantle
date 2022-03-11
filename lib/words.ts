import { WORDS } from "../constants/wordlist";
import { VALID_GUESSES } from "../constants/validGuesses";
import { WRONG_SPOT_MESSAGE, NOT_CONTAINED_MESSAGE, SOLUTION_PASSPHRASE } from "../constants/strings";
import { getGuessStatuses } from "./statuses";
import { default as GraphemeSplitter } from "grapheme-splitter";
import CryptoJS from "crypto-js";

const WORDS_SET = new Set(WORDS);
const VALID_GUESSES_SET = new Set(VALID_GUESSES);

export const isWordInWordList = (word: string) => {
  return WORDS_SET.has(localeAwareLowerCase(word)) || VALID_GUESSES_SET.has(localeAwareLowerCase(word));
};

export const isWinningWord = (word: string, solution: string) => {
  return solution === word;
};

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (word: string, guesses: string[], solution: string) => {
  if (guesses.length === 0) {
    return false;
  }

  const lettersLeftArray = new Array<string>();
  const guess = guesses[guesses.length - 1];
  const statuses = getGuessStatuses(guess, solution);
  const splitWord = unicodeSplit(word);
  const splitGuess = unicodeSplit(guess);

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === "correct" || statuses[i] === "present") {
      lettersLeftArray.push(splitGuess[i]);
    }
    if (statuses[i] === "correct" && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1);
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n;
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter);
    if (n !== -1) {
      lettersLeftArray.splice(n, 1);
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0]);
  }
  return false;
};

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length;
};

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase();
};

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase();
};

export const encryptWithAES = (text: string) => {
  return CryptoJS.AES.encrypt(text, SOLUTION_PASSPHRASE).toString();
};

export const decryptWithAES = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SOLUTION_PASSPHRASE);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export const capitalize = (name: string) => name.slice(0, 1).toUpperCase() + name.substring(1).toLowerCase();

export const getWordOfDay = (timestamp?: number) => {
  const epochMs = new Date(2022, 2, 8).valueOf();
  const now = timestamp ? new Date(timestamp).getTime() : Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);
  const nextday = (index + 1) * msInDay + epochMs;
  const solution = localeAwareUpperCase(WORDS[index % WORDS.length]);

  return {
    solution,
    solutionIndex: index,
    tomorrow: nextday,
  };
};
