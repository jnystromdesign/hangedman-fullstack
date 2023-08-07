export interface PlayerView {
  id: number;
  failstack: string[];
  currentProgress: string;
}

export type PlayerStatus = PlayerView & { word: string };
