import Countdown from "react-countdown";
import { StatBar } from "../stats/StatBar";
import { Histogram } from "../stats/Histogram";
import { GameStats } from "../../lib/localStorage";
import { getTextToShare, shareStatus } from "../../lib/share";
import { tomorrow } from "../../lib/words";
import { BaseModal } from "./BaseModal";
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  TWEET_TEXT,
} from "../../constants/strings";
import { ShareIcon } from "@heroicons/react/outline";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  guesses: string[];
  gameStats: GameStats;
  isGameLost: boolean;
  isGameWon: boolean;
  handleShareToClipboard: () => void;
  isHardMode: boolean;
  isDarkMode: boolean;
  isHighContrastMode: boolean;
};

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-3"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
}: Props) => {
  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal title={STATISTICS_TITLE} isOpen={isOpen} handleClose={handleClose}>
        <StatBar gameStats={gameStats} />
      </BaseModal>
    );
  }
  return (
    <BaseModal title={STATISTICS_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <StatBar gameStats={gameStats} />
      <h4 className="mt-3 text-lg leading-6 font-semibold text-slate-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram gameStats={gameStats} />
      {(isGameLost || isGameWon) && (
        <div className="mt-5 sm:mt-6 flex dark:text-white">
          <div className="w-1/2 mx-auto">
            <h5>{NEW_WORD_TEXT}</h5>
            <Countdown
              className="text-lg font-medium text-slate-900 dark:text-gray-100"
              date={tomorrow}
              daysInHours={true}
            />
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <button
              type="button"
              className="my-2 w-full max-w-[120px] flex justify-center items-center rounded-md border border-transparent shadow-sm p-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none"
              onClick={() => {
                shareStatus(guesses, isGameLost, isHardMode, isDarkMode, isHighContrastMode, handleShareToClipboard);
              }}
            >
              {SHARE_TEXT}
              <ShareIcon className="h-5 w-5 ml-3" />
            </button>
            <a
              className="p-2 w-full max-w-[120px] bg-sky-400 hover:bg-sky-500 text-white flex justify-center items-center text-base font-medium shadow-sm rounded-md"
              href={`https://twitter.com/intent/tweet?text=${getTextToShare(
                guesses,
                isGameLost,
                isHardMode,
                isDarkMode,
                isHighContrastMode,
                true
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {TWEET_TEXT}
              <TwitterIcon />
            </a>
          </div>
        </div>
      )}
    </BaseModal>
  );
};
