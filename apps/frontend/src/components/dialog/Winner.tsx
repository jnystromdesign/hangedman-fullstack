export const DialogWinner = (props: { resetGame: () => void; show: boolean }) =>
  props.show ? (
    <div className="dialog">
      <h1>You are awesome! 👑</h1>
      <button onClick={props.resetGame}>Play again</button>
    </div>
  ) : null;
