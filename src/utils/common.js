const ONE_CHARACTER_LENGTH = 1;
const UPPERCASE_CHARACTER_INDEX = 0;
const LOWERCASE_FIRST_CHARACTER_INDEX = 1;

const isAlphabetsCharacter = (text) => {
  return (
    typeof text === `string` &&
    text.length === ONE_CHARACTER_LENGTH &&
    /[A-Za-z]/.test(text)
  );
};

export const getSnakeCaseText = (inputText) => {
  let alphabetText = ``;
  for (let i = 0; i < inputText.length; ++i) {
    if (isAlphabetsCharacter(inputText[i]) || inputText[i] === ` `) {
      alphabetText += inputText[i];
    }
  }

  const resultText = alphabetText
    .split(` `)
    .map((part) => part.toLowerCase())
    .join(`-`);

  return resultText;
};

export const getCapitalizedWord = (word) =>
  `${word[UPPERCASE_CHARACTER_INDEX].toUpperCase()}${word.slice(LOWERCASE_FIRST_CHARACTER_INDEX)}`;
