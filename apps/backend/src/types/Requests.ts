export interface RequestBodyLetter {
  letter: string;
}

export type ResponsStatus =
  | "Invalid payload"
  | "forbidden reattempt"
  | "sucess"
  | "failed attempt";
