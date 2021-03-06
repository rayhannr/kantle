import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Grid } from "./grid/Grid";
import { Keyboard } from "./keyboard/Keyboard";
import InfoModal from "./modals/InfoModal";
import StatsModal from "./modals/StatsModal";
import SettingsModal from "./modals/SettingsModal";
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  GAME_MODE_KEY,
  SOLUTION_MEANING_KEY,
} from "../constants/strings";
import {
  MAX_WORD_LENGTH,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_LOST_INFO_DELAY,
  WELCOME_INFO_MODAL_MS,
  DANCE_TIME_MS,
  MODAL_EXIT_DURATION,
} from "../constants/settings";
import { isWordInWordList, isWinningWord, findFirstUnusedReveal, unicodeLength, encrypt, decrypt } from "../lib/words";
import { addStatsForCompletedGame, loadStats } from "../lib/stats";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "../lib/localStorage";
import { AlertContainer } from "../components/alerts/AlertContainer";
import { useAlert } from "../context/AlertContext";
import { Navbar } from "../components/navbar/Navbar";
import Head from "next/head";
import { useSolution } from "../context/SolutionContext";
import { useExtendedTheme } from "../lib/theme";
import { useDelayUnmount } from "../lib/animation";
import { addRoundRectToCanvasContext } from "../lib/share";

function App() {
  const { solution, solutionIndex } = useSolution();
  const { isDarkMode } = useExtendedTheme();

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } = useAlert();
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const shouldRenderInfoModal = useDelayUnmount(isInfoModalOpen, MODAL_EXIT_DURATION);
  const shouldRenderStatsModal = useDelayUnmount(isStatsModalOpen, MODAL_EXIT_DURATION);
  const shouldRenderSettingsModal = useDelayUnmount(isSettingsModalOpen, MODAL_EXIT_DURATION);

  const [currentRowClass, setCurrentRowClass] = useState("");
  const [isGameLost, setIsGameLost] = useState(false);
  const [isHighContrastMode, setIsHighContrastMode] = useState(getStoredIsHighContrastMode());
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage();
    const decryptedSolution = decrypt(loaded?.solution || "");
    if (decryptedSolution !== solution) {
      removeFromStorage(SOLUTION_MEANING_KEY);
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

  const [isHardMode, setIsHardMode] = useState(
    getFromStorage(GAME_MODE_KEY) ? getFromStorage(GAME_MODE_KEY) === "hard" : false
  );

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
    setCurrentGuess((prev) => prev.slice(0, -1));
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
    if (isHighContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrastMode]);

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution: encrypt(solution) });
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

  useEffect(() => {
    addRoundRectToCanvasContext();
  }, []);

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
        {shouldRenderInfoModal && (
          <InfoModal handleClose={() => setIsInfoModalOpen(false)} isMounted={isInfoModalOpen} />
        )}
        {shouldRenderStatsModal && (
          <StatsModal
            handleClose={() => setIsStatsModalOpen(false)}
            guesses={guesses}
            gameStats={stats}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            isHardMode={isHardMode}
            isHighContrastMode={isHighContrastMode}
            isMounted={isStatsModalOpen}
          />
        )}
        {shouldRenderSettingsModal && (
          <SettingsModal
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
            isMounted={isSettingsModalOpen}
          />
        )}
        <AlertContainer />
      </div>
    </div>
  );
}

export default App;
