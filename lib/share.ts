import { getGuessStatuses } from "./statuses";
import { GAME_DOMAIN, GAME_NAME } from "../constants/strings";
import { MAX_CHALLENGES, MAX_WORD_LENGTH } from "../constants/settings";
import { UAParser } from "ua-parser-js";
import { isInClient } from "./dom";

const webShareApiDeviceTypes: string[] = ["mobile", "smarttv", "wearable"];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

export interface ShareProps {
  guesses: string[];
  solution: string;
  solutionIndex: number;
  isGameLost: boolean;
  isHardMode: boolean;
  isDarkMode: boolean;
  isHighContrastMode: boolean;
}

export const getTextToShare = ({ isUrl = false, ...params }: ShareProps & { isUrl?: boolean }) => {
  const { guesses, solution, solutionIndex, isGameLost, isDarkMode, isHardMode, isHighContrastMode } = params;
  const textToShare =
    `${GAME_NAME} ${solutionIndex + 1} ${isGameLost ? "X" : guesses.length}/${MAX_CHALLENGES}${
      isHardMode ? "*" : ""
    }\n\n` +
    generateEmojiGrid(guesses, getEmojiTiles(isDarkMode, isHighContrastMode), solution) +
    `\n\n${process.env.NEXT_PUBLIC_BASE_URL!}`;

  return isUrl ? encodeURIComponent(textToShare) : textToShare;
};

export const shareStatus = ({
  handleShareToClipboard,
  ...params
}: ShareProps & { handleShareToClipboard: () => void }) => {
  const textToShare = getTextToShare(params);

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

export const shareImage = async ({ isWithAnswer = false, ...params }: ShareProps & { isWithAnswer?: boolean }) => {
  if (!isInClient()) return;

  const { guesses, isDarkMode, isGameLost, isHardMode, isHighContrastMode, solution, solutionIndex } = params;
  const canvas = document.createElement("canvas");
  canvas.height = 1600;
  canvas.width = 900;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = isDarkMode ? "#0f172a" : "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gap = 10;
  const paddingX = 100;
  const paddingT = 400;
  const size = (canvas.width - paddingX * 2 - gap * (MAX_WORD_LENGTH - 1)) / MAX_WORD_LENGTH;

  const score = isGameLost ? "X" : guesses.length;
  const hardModeMarker = isHardMode ? "*" : "";
  const text = `${GAME_NAME} ${solutionIndex + 1} ${score}/${MAX_CHALLENGES}${hardModeMarker}\n\n`;
  ctx.font = "bold 42px Inter";
  ctx.textAlign = "center";
  ctx.fillStyle = isDarkMode ? "#ffffff" : "#0f172a";
  ctx.fillText(text, canvas.width / 2, 300);
  ctx.font = "32px Inter";
  ctx.fillText(GAME_DOMAIN, canvas.width / 2, canvas.height - 150);

  guesses.forEach((guess, y) => {
    const statuses = getGuessStatuses(guess, solution);
    statuses.forEach((status, x) => {
      if (status === "correct") {
        ctx.fillStyle = isHighContrastMode ? "#f97316" : "#16a34a";
      } else if (status === "present") {
        ctx.fillStyle = isHighContrastMode ? "#0ea5e9" : "#f59e0b";
      } else {
        ctx.fillStyle = isDarkMode ? "#334155" : "#94a3b8";
      }

      const marginX = gap * x;
      const marginY = gap * y;
      const rectX = paddingX + x * size + marginX;
      const rectY = paddingT + y * size + marginY;

      ctx.beginPath();
      ctx.rect(rectX, rectY, size, size);
      ctx.fill();

      if (!isWithAnswer) return;
      ctx.font = "bold 54px Inter";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(guess[x].toUpperCase(), rectX + size / 2, rectY + size / 1.5);
    });
  });

  const dataUrl = canvas.toDataURL();
  const blob = await (await fetch(dataUrl)).blob();

  const imageName = `${GAME_NAME.toLowerCase()}-${solutionIndex}${isWithAnswer ? "-with-answers" : ""}`;
  const shareData = {
    files: [
      new File([blob], `${imageName}.jpg`, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      }),
    ],
  };

  let canShareImage = false;
  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      canShareImage = true;
    }
  } catch (error) {
    canShareImage = false;
  }

  if (!canShareImage) {
    const { saveAs } = await import("file-saver").then((mod) => mod.default);
    saveAs(blob, imageName);
  }
};
