export const DisplayLettersNotInWord = (props: {
  failstack: string[];
  show: boolean;
}) =>
  props.show ? (
    <div>Letters not in word: {props.failstack.join(", ")}</div>
  ) : (
    <div>So far so good!</div>
  );
