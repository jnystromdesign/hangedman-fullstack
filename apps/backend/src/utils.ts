export function updateMaskedWord(
  word: string,
  letter: string,
  currentProgress: string
): string {
  const indexesOfLetters = word
    .split("")
    .reduce((maskedText, curr, index) => {
      if (curr === letter) {
        maskedText[index] = letter;
      }
      return maskedText;
    }, currentProgress.split(""))
    .join("");
  return indexesOfLetters;
}

export const maskWord = (word: string) => Array(word.length).fill("*").join("");

export function compliesWithRules(letter: string): boolean {
  if (!isLowerCase(letter)) return false;
  return /^\w$/.test(letter);
}

function isLowerCase(str) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}
