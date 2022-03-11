import { getGuessStatuses } from "./statuses";
import { GAME_NAME } from "../constants/strings";
import { MAX_CHALLENGES } from "../constants/settings";
import { UAParser } from "ua-parser-js";

const webShareApiDeviceTypes: string[] = ["mobile", "smarttv", "wearable"];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

export const getTextToShare = (
  guesses: string[],
  solution: string,
  solutionIndex: number,
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  isUrl: boolean = false
) => {
  const textToShare =
    `${GAME_NAME} ${solutionIndex + 1} ${lost ? "X" : guesses.length}/${MAX_CHALLENGES}${isHardMode ? "*" : ""}\n\n` +
    generateEmojiGrid(guesses, getEmojiTiles(isDarkMode, isHighContrastMode), solution) +
    `\n\n${process.env.REACT_APP_BASE_URL!}`;

  return isUrl ? encodeURIComponent(textToShare) : textToShare;
};

export const shareStatus = (
  guesses: string[],
  solution: string,
  solutionIndex: number,
  lost: boolean,
  isHardMode: boolean,
  isDarkMode: boolean,
  isHighContrastMode: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare = getTextToShare(
    guesses,
    solution,
    solutionIndex,
    lost,
    isHardMode,
    isDarkMode,
    isHighContrastMode
  );

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare);
    handleShareToClipboard();
  }
};

export const generateEmojiGrid = (guesses: string[], tiles: string[], solution: string) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess, solution);
      return guess
        .split("")
        .map((_, i) => {
          switch (status[i]) {
            case "correct":
              return tiles[0];
            case "present":
              return tiles[1];
            default:
              return tiles[2];
          }
        })
        .join("");
    })
    .join("\n");
};

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf("FIREFOX") === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? "") !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};

const getEmojiTiles = (isDarkMode: boolean, isHighContrastMode: boolean) => {
  let tiles: string[] = [];
  tiles.push(isHighContrastMode ? "🟧" : "🟩");
  tiles.push(isHighContrastMode ? "🟦" : "🟨");
  tiles.push(isDarkMode ? "⬛" : "⬜");
  return tiles;
};
