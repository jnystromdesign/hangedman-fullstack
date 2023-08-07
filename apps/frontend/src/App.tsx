import { useEffect, useMemo, useRef, useState } from "react";
import type { SuperThing } from "hangedman-types";
import "./App.css";
import Letters from "./components/Letters";
import axios from "axios";
import { StatusDTO } from "./types/Dto";

function App() {
  const [progress, setProgress] = useState("");
  const [failstack, setFailstack] = useState<SuperThing[]>([]);
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

  const resetGame = () => {
    document.cookie = "sessionId" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location = window.location;
  };

  const getNewGame = () => {
    axios
      .get<StatusDTO>("http://localhost:3000/", {
        withCredentials: true,
      })
      .catch((error) => {})
      .then((respons) => {
        if (respons?.data.currentProgress) {
          setProgress(respons?.data.currentProgress);
          setFailstack(respons.data.failstack);
        }
      });
  };

  const revealCorrectWord = () => {
    axios
      .get<string>("http://localhost:3000/reveal-word", {
        withCredentials: true,
      })
      .catch((error) => {})
      .then((respons) => {
        if (respons?.data) {
          setFullWord(respons?.data);
        }
      });
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

  const onKeySubmit = async (letter: string) => {
    const respons = await axios
      .post<{ playerStatus: StatusDTO }>(
        "http://localhost:3000/letter",
        { letter },
        {
          withCredentials: true,
        }
      )
      .catch((error) => {
        console.log("error", error);
      });
    if (respons?.data) {
      console.log(respons.data);
      setProgress(respons.data.playerStatus.currentProgress);
      setFailstack(respons.data.playerStatus.failstack);
    }
  };

  return (
    <>
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
          <div>Remaining attempts: {8 - failstack.length}/8</div>
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
