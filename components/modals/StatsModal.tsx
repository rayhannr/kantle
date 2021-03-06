import { StatBar } from "../stats/StatBar";
import { Histogram } from "../stats/Histogram";
import { GameStats, getFromStorage, setToStorage } from "../../lib/localStorage";
import { getTextToShare, shareImage, ShareProps, shareStatus } from "../../lib/share";
import { capitalize } from "../../lib/words";
import { BaseModal } from "./BaseModal";
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  TWEET_TEXT,
  IMAGE_TEXT,
  IMAGE_CHECKBOX_TEXT,
  SOLUTION_MEANING_KEY,
} from "../../constants/strings";
import { useSolution } from "../../context/SolutionContext";
import { getKBBIUrl } from "../../lib/stats";
import Button from "../Button";
import { useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { useExtendedTheme } from "../../lib/theme";
import { ShareIcon, PhotographIcon } from "../Icons";
import Countdown from "../Countdown";
import { useRemainingTime } from "../../lib/time";

type Props = {
  handleClose: () => void;
  guesses: string[];
  gameStats: GameStats;
  isGameLost: boolean;
  isGameWon: boolean;
  handleShareToClipboard: () => void;
  isHardMode: boolean;
  isHighContrastMode: boolean;
  isMounted: boolean;
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

const StatsModal = ({
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  isHardMode,
  isHighContrastMode,
  isMounted,
}: Props) => {
  const { solution, solutionIndex, tomorrow } = useSolution();
  const remainingTime = useRemainingTime();
  const { isDarkMode } = useExtendedTheme();
  const [isWithAnswer, setIsWithAnswer] = useState<boolean>(false);

  const storedMeaning = getFromStorage(SOLUTION_MEANING_KEY);
  const shouldFetch = (isGameLost || isGameWon) && !storedMeaning;
  const { data, error } = useSWR(shouldFetch ? `/api/define/${solution}` : null, fetcher);
  const solutionMeaning = data?.arti ? data?.arti : storedMeaning ? JSON.parse(storedMeaning) : "";

  useEffect(() => {
    if (!data) return;

    setToStorage(SOLUTION_MEANING_KEY, JSON.stringify(solutionMeaning));
  }, [data, solutionMeaning]);

  const onChangeIsWithAnswer = () => {
    setIsWithAnswer((prev) => !prev);
  };

  const shareParams: ShareProps = {
    guesses,
    solution,
    solutionIndex,
    isDarkMode,
    isGameLost,
    isHardMode,
    isHighContrastMode,
  };

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal title={STATISTICS_TITLE} {...{ handleClose, isMounted }}>
        <StatBar gameStats={gameStats} />
      </BaseModal>
    );
  }
  return (
    <BaseModal title={STATISTICS_TITLE} {...{ handleClose, isMounted }}>
      <StatBar gameStats={gameStats} />
      <h4 className="mt-3 text-lg leading-6 font-semibold text-slate-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram {...{ gameStats, guesses, isGameWon }} />
      {(isGameLost || isGameWon) && (
        <>
          <div className="min-h-[80px]">
            <div className="text-slate-900 dark:text-white text-left ml-2 mt-4">
              <p className="font-semibold text-sm mb-1">Kata hari ini : {capitalize(solution)}</p>
              {!data && !solutionMeaning && !error && <p className="text-xs mb-1">Memuat arti kata...</p>}
              {!!error && <p className="text-xs mb-1">Gagal memuat arti kata</p>}
              {!!solutionMeaning && (
                <>
                  {Array.isArray(solutionMeaning) ? (
                    <ul className="list-disc ml-4">
                      {solutionMeaning.map((meaning) => (
                        <li key={meaning} className="text-xs mb-1">
                          {capitalize(meaning)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs mb-1">{capitalize(solutionMeaning)}</p>
                  )}
                  <a
                    href={getKBBIUrl(solution)}
                    rel="noreferrer"
                    target="_blank"
                    className="text-sm text-blue-500 dark:text-sky-500 outline-none hover:underline hover:underline-offset-4"
                  >
                    Lihat di KBBI
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex dark:text-white">
            <div className="w-1/2 mx-auto">
              <h5>{NEW_WORD_TEXT}</h5>
              <Countdown time={remainingTime} />
            </div>
            <div className="w-1/2 flex flex-col">
              <Button onClick={() => shareStatus({ ...shareParams, handleShareToClipboard })} className="mt-2">
                {SHARE_TEXT}
                <ShareIcon className="h-5 w-5 ml-3" />
              </Button>
              <Button
                onClick={() => shareImage({ ...shareParams, isWithAnswer })}
                className="bg-ig my-2"
                isPrimary={false}
              >
                {IMAGE_TEXT}
                <PhotographIcon className="h-5 w-5 ml-3" />
              </Button>
              <Checkbox isChecked={isWithAnswer} onChange={onChangeIsWithAnswer} label={IMAGE_CHECKBOX_TEXT} />
              <a
                className="p-2 w-full bg-sky-400 hover:bg-sky-500 text-white flex justify-center items-center text-base font-medium shadow-sm rounded-md"
                href={`https://twitter.com/intent/tweet?text=${getTextToShare({ ...shareParams, isUrl: true })}`}
                target="_blank"
                rel="noreferrer"
              >
                {TWEET_TEXT}
                <TwitterIcon />
              </a>
            </div>
          </div>
        </>
      )}
    </BaseModal>
  );
};

export default StatsModal;
