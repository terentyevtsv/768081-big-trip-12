import moment from "moment";

const MONTH_NAMES = [
  `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`,
  `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
];

const zeroBasedFormat = (value) => {
  return value >= 10 ? `${value}` : `0${value}`;
};

export const dateToString = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const newDate =
    `${date.getFullYear()}.${zeroBasedFormat(month)}.${zeroBasedFormat(day)}`;
  return newDate;
};

export const monthDayToString = (date) => {
  const day = date.getDate();

  return `${MONTH_NAMES[date.getMonth()]} ${zeroBasedFormat(day)}`;
};

export const timeToString = (date) => {
  const hours = zeroBasedFormat(date.getHours());
  const minutes = zeroBasedFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const fullDateToString = (date) => {
  // 2019-03-18T11:00
  const month = date.getMonth() + 1;

  return `${date.getFullYear()}-${zeroBasedFormat(month)}-${zeroBasedFormat(date.getDate())}T${timeToString(date)}`;
};

export const shortYearDateToString = (date) => {
  // для формы редактирования
  const day = zeroBasedFormat(date.getDate());
  const month = zeroBasedFormat(date.getMonth() + 1);
  const year = zeroBasedFormat(date.getFullYear());
  const hours = zeroBasedFormat(date.getHours());
  const minutes = zeroBasedFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getDeltaDateInformation = (date1, date2) => {
  const dateDifference = date2 - date1;
  const duration = moment.duration(dateDifference);

  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes()
  };
};

export const getDeltaTimeFormat = (days, hours, minutes) => {
  // 01D 02H 30M
  let delta = ``;
  if (days > 0) {
    delta += `${zeroBasedFormat(days)}D `;
  }

  if (hours > 0) {
    delta += `${zeroBasedFormat(hours)}H `;
  }

  delta += `${zeroBasedFormat(minutes)}M`;

  delta = delta.trimRight();

  return delta;
};

export const getDatesDelta = (date1, date2) => {
  const {days, hours, minutes} = getDeltaDateInformation(date1, date2);

  // 01D 02H 30M
  const delta = getDeltaTimeFormat(days, hours, minutes);

  return delta;
};

export const getDateForInterval = (date1) =>
  `${zeroBasedFormat(date1.getDate())} ${MONTH_NAMES[date1.getMonth()].toUpperCase()}`;
