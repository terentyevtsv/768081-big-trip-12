export const AddedComponentPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

export const render = (container, template, place) => container.insertAdjacentHTML(place, template);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const dateToString = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const newDate =
    `${date.getFullYear()}.${month >= 10 ? month : `0${month}`}.${day >= 10 ? day : `0${day}`}`;
  return newDate;
};

export const monthDayToString = (date) => {
  const monthNames = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`,
    `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
  ];

  const day = date.getDate();

  return `${monthNames[date.getMonth()]} ${day >= 10 ? day : `0${day}`}`;
};
