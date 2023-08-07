import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import {
  addPlayer,
  addToPlayerFailStack,
  getPlayer,
  removePlayer,
  updatePlayerProgress,
} from "./state";

import { SESSION_KEY } from "./config";
import { getRandomWord } from "./api-client";
import { PlayerStatus, PlayerView } from "hangedman-types";
import { updateMaskedWord, compliesWithRules } from "./utils";
import { RequestBodyLetter, ResponsStatus } from "./types/Requests";

runApp();

async function runApp() {
  const app = fastify({
    // logger: true,
  });

  app.register(fastifyCors, {
    origin: "http://localhost:1337",
    methods: ["POST", "GET"],
    credentials: true,
  });

  app.register(fastifyCookie, {
    secret: SESSION_KEY,
    hook: "onRequest",
  });

  app.get("/", async (req, rep): Promise<PlayerView> => {
    let sessionId = Number(req.cookies.sessionId);
    let playerStatus: null | PlayerStatus = null;
    if (!sessionId) {
      sessionId = Date.now();
      const word = await getRandomWord().catch((error) => {
        rep.statusCode = 500;
        //TODO: Better error handling
        return {
          status: "Service problem",
          message:
            "Sorry! We are having issues with our services. If the problem persists please send a message to support@hangedman.com (We'd really appriciate it)",
        };
      });
      playerStatus = await addPlayer(sessionId, word);
      rep.setCookie("sessionId", `${sessionId}`);
    } else {
      playerStatus = await getPlayer(sessionId).catch((errro) => {
        console.log("reloading app since code is not here");
        rep.redirect("/logout");
      });
    }
    const { id, currentProgress, failstack } = playerStatus;
    return { id, currentProgress, failstack };
  });

  app.get("/reveal-word", async (req, rep): Promise<string> => {
    let sessionId = Number(req.cookies.sessionId);
    const playerStatus = await getPlayer(sessionId);
    return playerStatus.word;
  });

  app.get("/logout", async (req, rep): Promise<void> => {
    let sessionId = Number(req.cookies.sessionId);
    if (sessionId) {
      await removePlayer(Number(sessionId));
      rep.clearCookie("sessionId", { path: "/" });
    }
    rep.redirect("/");
  });

  app.post(
    "/letter",
    async (
      req,
      rep
    ): Promise<{
      status: ResponsStatus;
      message?: string;
      playerStatus?: PlayerStatus;
    }> => {
      let sessionId = Number(req.cookies.sessionId);
      console.log(req.cookies);
      // if (!sessionId) rep.redirect("/");
      const playerStatus = await getPlayer(sessionId);

      const { letter } = req.body as RequestBodyLetter;

      if (!compliesWithRules(letter)) {
        rep.statusCode = 400;
        return {
          status: "Invalid payload",
          message:
            "You must pass only one (1) lowercase letter in the range a-z per request.",
        };
      }

      if (playerStatus.failstack.includes(letter)) {
        return {
          status: "forbidden reattempt",
          message: `Letter ${letter} is already used and it's not in the word`,
        };
      }

      if (playerStatus.word.includes(letter)) {
        const updatedProgress = updateMaskedWord(
          playerStatus.word,
          letter,
          playerStatus.currentProgress
        );
        const newPlayerStatus = await updatePlayerProgress(
          playerStatus.id,
          updatedProgress
        );
        return {
          status: "sucess",
          playerStatus: newPlayerStatus,
        };
      } else {
        const failedAttemtStatus = await addToPlayerFailStack(
          playerStatus.id,
          letter
        );
        return {
          status: "failed attempt",
          playerStatus: failedAttemtStatus,
        };
      }
    }
  );

  try {
    await app.listen({ port: 3000 });
    console.log("Site is available on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
