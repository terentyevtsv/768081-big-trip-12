const isAlphabetsCharacter = (character) => {
  return typeof character === `string` && character.length === 1 && /[A-Za-z]/.test(character);
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
  `${word[0].toUpperCase()}${word.slice(1)}`;
