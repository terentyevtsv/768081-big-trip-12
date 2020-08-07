export const AddedComponentPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

const zeroBasedFormat = (value) => {
  return value >= 10 ? `${value}` : `0${value}`;
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
    `${date.getFullYear()}.${zeroBasedFormat(month)}.${zeroBasedFormat(day)}`;
  return newDate;
};

export const monthDayToString = (date) => {
  const monthNames = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`,
    `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
  ];

  const day = date.getDate();

  return `${monthNames[date.getMonth()]} ${zeroBasedFormat(day)}`;
};

export const timeToString = (date) => {
  let hours = zeroBasedFormat(date.getHours());
  let minutes = zeroBasedFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const fullDateToString = (date) => {
  // 2019-03-18T11:00
  const month = date.getMonth() + 1;

  return `${date.getFullYear()}-${zeroBasedFormat(month)}-${zeroBasedFormat(date.getDate())}T${timeToString(date)}`;
};

export const getDatesDelta = (date1, date2) => {
  let dateDelta = date2 - date1;

  const millisInDay = 1000 * 60 * 60 * 24;
  const millisInHour = 1000 * 60 * 60;
  const millisInMinute = 1000 * 60;
  const millisInSecond = 1000;

  const daysCount = Math.floor(dateDelta / millisInDay);
  dateDelta = dateDelta - daysCount * millisInDay;

  const hoursCount = Math.floor(dateDelta / millisInHour);
  dateDelta = dateDelta - hoursCount * millisInHour;

  const minutesCount = Math.floor(dateDelta / millisInMinute);
  dateDelta = dateDelta - minutesCount * millisInMinute;

  const secondsCount = Math.floor(dateDelta / millisInSecond);
  dateDelta = dateDelta - secondsCount * millisInSecond;

  // 01D 02H 30M
  let delta = ``;
  if (daysCount > 0) {
    delta += `${zeroBasedFormat(daysCount)}D `;
  }

  if (hoursCount > 0) {
    delta += `${zeroBasedFormat(hoursCount)}H `;
  }

  if (minutesCount > 0) {
    delta += `${zeroBasedFormat(minutesCount)}M`;
  }

  delta = delta.trimRight();

  return delta;
};
