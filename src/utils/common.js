export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const isAlpha = (ch) => {
  return typeof ch === `string` && ch.length === 1 && /[A-Za-z]/.test(ch);
};

export const getSnakeCaseString = (str) => {
  let alphaString = ``;
  for (let i = 0; i < str.length; ++i) {
    if (isAlpha(str[i]) || str[i] === ` `) {
      alphaString += str[i];
    }
  }

  const resultString = alphaString
    .split(` `)
    .map((part) => part.toLowerCase())
    .join(`-`);

  return resultString;
};

export const getCapitalizedWord = (word) =>
  `${word[0].toUpperCase()}${word.slice(1)}`;
