export const DialogWinner = (props: {
  resetGame: () => void;
  show: boolean;
  fullWord: string;
}) =>
  props.show ? (
    <div className="dialog">
      <h2>You are awesome! 👑</h2>
      <p>The word we were looking for was</p>
      <h1>{props.fullWord}</h1>
      <button onClick={props.resetGame}>Play again</button>
    </div>
  ) : null;
