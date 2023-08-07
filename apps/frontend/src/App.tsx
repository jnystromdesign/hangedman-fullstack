import { useEffect, useMemo, useRef, useState } from "react";
import type { PlayerStatus } from "hangedman-types";
import Letters from "./components/Letters";
import { apiClient } from "./api-client";

function App() {
  const [progress, setProgress] = useState("");
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
    return progress && !progress.includes("*");
  }, [progress]);

  const refreshApp = () => {
    window.location = window.location;
  };

  const resetGame = () => {
    document.cookie = "sessionId" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    refreshApp();
  };

  const getNewGame = () => {
    apiClient
      .get<PlayerStatus>("/")
      .catch((error) => {
        setAppError(error);
      })
      .then((respons) => {
        if (respons?.data.currentProgress) {
          setProgress(respons?.data.currentProgress);
          setFailstack(respons.data.failstack);
        }
      });
  };

  const revealCorrectWord = () => {
    apiClient
      .get<string>("/reveal-word")
      .catch((error) => {
        setAppError(error);
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
      setProgress(respons.data.playerStatus.currentProgress);
      setFailstack(respons.data.playerStatus.failstack);
    }
  };

  useEffect(() => {
    if (failstack.length <= 8) {
      revealCorrectWord();
    }
  }, [failstack]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getNewGame();
    }
  }, []);

  return (
    <>
      {appError && (
        <div>
          <h2>We encountered a problem</h2>
          <p>{appError} </p>
          <button onClick={refreshApp}>Refresh app to try to fix it</button>
        </div>
      )}
      {gameWon && (
        <div
          style={{
            color: "white",
            backgroundColor: "lime",
            padding: ".25rem",
            borderRadius: "0.5rem",
          }}
        >
          <h1>Great Success!</h1>
          <button onClick={resetGame}>Play again</button>
        </div>
      )}

      {!gameOver && <h1>{progress}</h1>}

      {gameOver && fullWord && (
        <div style={{ paddingBottom: "1rem" }}>
          <h1>You lose!</h1>
          <p>
            Sorry (not sorry)! The word we were looking for were{" "}
            <strong>{fullWord}</strong>
          </p>
          <button onClick={resetGame}>Try again!</button>
        </div>
      )}

      {!gameOver && (
        <div>
          <div>
            Remaining attempts:{" "}
            {Array(8 - failstack.length)
              .fill("❤️")
              .map((life) => life)}
          </div>
          <div>Letters not in word: {failstack.join(", ")}</div>
        </div>
      )}

      <Letters
        disabled={gameOver}
        onPress={onKeySubmit}
        usedLetters={lettersInUse}
      />
      <button onClick={resetGame}>New word please</button>
    </>
  );
}

export default App;
