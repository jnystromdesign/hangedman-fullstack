import type { PlayerStatus } from "hangedman-types";
import { useEffect, useMemo, useRef, useState } from "react";
import Letters from "./components/Letters";
import { apiClient } from "./api-client";
import { AppError } from "./components/AppError";
import { DialogWinner } from "./components/dialog/Winner";
import { DialogLoser } from "./components/dialog/Loser";
import { DisplayAttemptLeft } from "./components/Display/AttemptsLeft";
import { DisplayLettersNotInWord } from "./components/Display/LettersNotInWord";
import { DisplayStatus } from "./components/Display/Status";
import {
  DisplayFeedBack,
  Feedback,
} from "./components/Display/Feedback/Feedback";

function App() {
  const [loadingWord, setLoadingWord] = useState(false);
  const [progress, setProgress] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(false);
  const [failstack, setFailstack] = useState<string[]>([]);
  const [appError, setAppError] = useState<false | string>(false);
  const [fullWord, setFullWord] = useState<null | string>(null);
  const initialized = useRef(false);

  const lettersInUse = useMemo((): string[] => {
    const lettersFromProgress = new Set(progress.replaceAll("*", "").split(""));
    return [...Array.from(lettersFromProgress), ...failstack].sort();
  }, [progress, failstack]);

  const gameOver = useMemo(() => {
    return failstack.length >= 8;
  }, [failstack]);

  const gameWon = useMemo(() => {
    return !!progress && !progress.includes("*");
  }, [progress]);

  const gamePlayable = useMemo(
    () => !gameOver && !gameWon,
    [gameOver, gameWon]
  );

  const refreshApp = () => {
    window.location = window.location;
  };

  const resetGame = () => {
    document.cookie = "sessionId" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    refreshApp();
  };

  const getNewGame = () => {
    setLoadingWord(true);
    apiClient
      .get<PlayerStatus>("/")
      .catch((error) => {
        setAppError(error.message);
      })
      .then((respons) => {
        if (respons?.data.currentProgress) {
          setProgress(respons?.data.currentProgress);
          setFailstack(respons.data.failstack);
        }
      })
      .finally(() => {
        setLoadingWord(false);
      });
  };

  const revealCorrectWord = () => {
    apiClient
      .get<string>("/reveal-word")
      .catch((error) => {
        setAppError(error.message);
      })
      .then((respons) => {
        if (respons?.data) {
          setFullWord(respons?.data);
        }
      });
  };

  const onKeySubmit = async (letter: string) => {
    const respons = await apiClient
      .post<{ playerStatus: PlayerStatus }>("/letter", {
        letter,
      })
      .catch((error) => {
        setAppError(error.message);
      });
    if (respons?.data) {
      const { playerStatus } = respons.data;
      createFeedback(playerStatus);
      setProgress(playerStatus.currentProgress);
      setFailstack(playerStatus.failstack);
    }
  };

  const createFeedback = (playerStatus: PlayerStatus) => {
    let feedback: Feedback = false;
    if (failstack.length != playerStatus.failstack.length) {
      feedback = "fail";
    }
    if (progress !== playerStatus.currentProgress) {
      feedback = "sucess";
    }
    setFeedback(feedback);
    setTimeout(() => setFeedback(false), 1000);
  };

  // Reveal word on game over
  useEffect(() => {
    if (progress && failstack.length <= 8) {
      revealCorrectWord();
    }
  }, [failstack]);

  // initial game
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getNewGame();
    }
  }, []);

  return (
    <>
      <AppError appError={appError} refreshApp={refreshApp} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DisplayLettersNotInWord
          show={!!failstack.length && gamePlayable}
          failstack={failstack}
        />
        <DisplayAttemptLeft show={gamePlayable} failstack={failstack} />
      </div>

      <DisplayFeedBack feedback={feedback} />

      <DialogWinner
        show={gameWon}
        resetGame={resetGame}
        fullWord={fullWord as string}
      />
      <DialogLoser
        show={gameOver && !!fullWord}
        resetGame={resetGame}
        fullWord={fullWord as string}
      />
      <DisplayStatus
        show={loadingWord || gamePlayable}
        progress={progress}
        loading={loadingWord}
      />
      {gamePlayable && (
        <>
          <Letters onPress={onKeySubmit} usedLetters={lettersInUse} />

          <p>Way too hard?</p>
          <button className="button--textlink" onClick={resetGame}>
            Get a new word!
          </button>
        </>
      )}
    </>
  );
}

export default App;
