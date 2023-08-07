export const DisplayLettersNotInWord = (props: {
  failstack: string[];
  show: boolean;
}) =>
  props.show ? (
    <div>Letters not in word: {props.failstack.join(", ")}</div>
  ) : null;
