const isAlpha = (ch) => {
  return typeof ch === `string` && ch.length === 1 && /[A-Za-z]/.test(ch);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
