export default (props: {
  usedLetters?: string[];
  disabled: boolean;
  onPress: (letter: string) => void;
}) => {
  const { onPress, usedLetters, disabled } = props;
  let increment = 0;
  const charCodeStart = 97; // start from lowercase "a"
  const allLetters = Array.from(
    Array(26).fill(charCodeStart),
    (val) => val + increment++
  ).map((charVal) => String.fromCharCode(charVal));
  const isInUse = (uniqueLetter: string) =>
    usedLetters?.length ? usedLetters.includes(uniqueLetter) : false;
  return (
    <div className="letter-keys">
      {allLetters.map((letter) => (
        <button
          disabled={disabled || isInUse(letter)}
          key={letter}
          onClick={() => onPress(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};
