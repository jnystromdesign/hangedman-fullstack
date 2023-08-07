export const DialogLoser = (props: {
  resetGame: () => void;
  show: boolean;
  fullWord: string;
}) => {
  const { fullWord, resetGame, show } = props;
  return show ? (
    <div style={{ paddingBottom: "1rem" }}>
      <h1>You lose!</h1>
      <p>
        Sorry (not sorry)! The word we were looking for were{" "}
        <strong>{fullWord}</strong>
      </p>
      <button onClick={resetGame}>Try again!</button>
    </div>
  ) : null;
};
