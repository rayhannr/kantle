import { useState, useEffect } from "react";
import { Grid } from "./grid/Grid";
import { Keyboard } from "./keyboard/Keyboard";
import { InfoModal } from "./modals/InfoModal";
import { StatsModal } from "./modals/StatsModal";
import { SettingsModal } from "./modals/SettingsModal";
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  THEME_KEY,
  GAME_MODE_KEY,
} from "../constants/strings";
import {
  MAX_WORD_LENGTH,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_LOST_INFO_DELAY,
  WELCOME_INFO_MODAL_MS,
  DANCE_TIME_MS,
} from "../constants/settings";
import {
  isWordInWordList,
  isWinningWord,
  findFirstUnusedReveal,
  unicodeLength,
  encryptWithAES,
  decryptWithAES,
} from "../lib/words";
import { addStatsForCompletedGame, loadStats } from "../lib/stats";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
  getFromStorage,
  setToStorage,
} from "../lib/localStorage";
import { default as GraphemeSplitter } from "grapheme-splitter";

import { AlertContainer } from "../components/alerts/AlertContainer";
import { useAlert } from "../context/AlertContext";
import { Navbar } from "../components/navbar/Navbar";
import { isInClient } from "../lib/dom";
import Head from "next/head";
import { useSolution } from "../context/SolutionContext";

function App() {
  const prefersDarkMode = isInClient() && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const { solution, solutionIndex } = useSolution();

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentRowClass, setCurrentRowClass] = useState("");
  const [isGameLost, setIsGameLost] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    getFromStorage(THEME_KEY) ? getFromStorage(THEME_KEY) === "dark" : prefersDarkMode ? true : false
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(getStoredIsHighContrastMode());
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage();
    const decryptedSolution = decryptWithAES(loaded?.solution || "");
    if (decryptedSolution !== solution) {
      return [];
    }
    const gameWasWon = loaded?.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded?.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      });
    }
    return loaded?.guesses || [];
  });

  const [stats, setStats] = useState(() => loadStats());
  const [solutionMeaning, setSolutionMeaning] = useState<string>("");

  const [isHardMode, setIsHardMode] = useState(
    getFromStorage(GAME_MODE_KEY) ? getFromStorage(GAME_MODE_KEY) === "hard" : false
  );

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    setToStorage(THEME_KEY, isDark ? "dark" : "light");
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem("gameMode") === "hard") {
      setIsHardMode(isHard);
      setToStorage(GAME_MODE_KEY, isHard ? "hard" : "normal");
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass("");
  };

  const onChar = (value: string) => {
    if (unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH && guesses.length < MAX_CHALLENGES && !isGameWon) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join(""));
  };

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return;
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass("jiggle");
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses, solution);
      if (firstMissingReveal) {
        setCurrentRowClass("jiggle");
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH);

    const winningWord = isWinningWord(currentGuess, solution);

    if (unicodeLength(currentGuess) === MAX_WORD_LENGTH && guesses.length < MAX_CHALLENGES && !isGameWon) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length, solutionIndex));
        return setIsGameWon(true);
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1, solutionIndex));
        setIsGameLost(true);
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
        });
      }
    }
  };

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }
  }, []);

  useEffect(() => {
    if (!isGameWon && !isGameLost) return;
    fetch(`/api/define/${solution}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) throw result.error;
        setSolutionMeaning(result.arti[0]);
      })
      .catch((error) => console.error(error));
  }, [isGameLost, isGameWon, solution]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isDarkMode, isHighContrastMode]);

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution: encryptWithAES(solution) });
  }, [guesses, solution]);

  useEffect(() => {
    if (isGameWon) {
      const winMessage = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = isRevealing ? REVEAL_TIME_MS * MAX_WORD_LENGTH : 0;

      setTimeout(() => {
        setIsDancing(true);
        setTimeout(() => {
          setIsDancing(false);
        }, DANCE_TIME_MS * MAX_WORD_LENGTH);
      }, delayMs);

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => {
          setIsStatsModalOpen(true);
          clearCurrentRowClass();
        },
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, GAME_LOST_INFO_DELAY);
    }
  }, [isGameWon, isGameLost, isRevealing, showSuccessAlert]);

  return (
    <div className="flex flex-col md:h-screen">
      <Head>
        <meta name="theme-color" content={isDarkMode ? "#0f172a" : "#ecfeff"} />
      </Head>
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />
      <div className="pt-2 px-1 pb-4 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
        <div className="pb-8 sm:pb-6 md:pb-4 md:grow">
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            isDancing={isDancing}
            currentRowClassName={currentRowClass}
          />
        </div>
        <Keyboard onChar={onChar} onDelete={onDelete} onEnter={onEnter} guesses={guesses} isRevealing={isRevealing} />
        <InfoModal isOpen={isInfoModalOpen} handleClose={() => setIsInfoModalOpen(false)} />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          guesses={guesses}
          gameStats={stats}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
          isHighContrastMode={isHighContrastMode}
          solutionMeaning={solutionMeaning}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
    </div>
  );
}

export default App;
