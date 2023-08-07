export interface PlayerView {
  id: number;
  failstack: string[];
  currentProgress: string;
}

export type PlayerStatus = PlayerView & { word: string };

export interface RequestBodyLetter {
  letter: string;
}

export type ResponsStatus =
  | "Invalid payload"
  | "forbidden reattempt"
  | "sucess"
  | "failed attempt";
