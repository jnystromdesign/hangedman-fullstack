import { JsonDB, Config } from "node-json-db";
import { PlayerStatus } from "./types/PlayerStatus";
import { maskWord } from "./utils";

const DB_PATH = "db/players";
var db = new JsonDB(new Config(DB_PATH, true, false, "/"));

export const addPlayer = async (
  user: number,
  word: string
): Promise<PlayerStatus> => {
  const playerStatus = initPlayerStatus(user, word);
  await db.push("/" + user, playerStatus);
  return playerStatus;
};

export const getPlayer = async (user: number): Promise<PlayerStatus> => {
  return await db.getData("/" + user);
};

export const updatePlayerProgress = async (
  user: number,
  currentProgress: string
): Promise<PlayerStatus> => {
  const currentStatus = await db.getData("/" + user);
  const dataUpdate = {
    ...currentStatus,
    currentProgress,
  };
  await db.push("/" + user, dataUpdate);
  return dataUpdate;
};

export const addToPlayerFailStack = async (
  user: number,
  letter: string
): Promise<PlayerStatus> => {
  const currentStatus = await db.getData("/" + user);
  const failstack = [...currentStatus.failstack, letter];
  const dataUpdate = {
    ...currentStatus,
    failstack,
  };
  await db.push("/" + user, dataUpdate);
  return dataUpdate;
};

export const removePlayer = async (user: number): Promise<number> => {
  await db.delete(`${user}`);
  return user;
};

const initPlayerStatus = (id: number, word: string): PlayerStatus => ({
  id,
  word,
  failstack: [],
  currentProgress: maskWord(word),
});
