const isAlphabetsCharacter = (character) => {
  return typeof character === `string` && character.length === 1 && /[A-Za-z]/.test(character);
};

export const getSnakeCaseString = (inputString) => {
  let alphabetString = ``;
  for (let i = 0; i < inputString.length; ++i) {
    if (isAlphabetsCharacter(inputString[i]) || inputString[i] === ` `) {
      alphabetString += inputString[i];
    }
  }

  const resultString = alphabetString
    .split(` `)
    .map((part) => part.toLowerCase())
    .join(`-`);

  return resultString;
};

export const getCapitalizedWord = (word) =>
  `${word[0].toUpperCase()}${word.slice(1)}`;
