import moment from "moment";

const MONTH_NAMES = [
  `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`,
  `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
];

const convertToZeroBasedFormat = (value) => {
  return value >= 10 ? `${value}` : `0${value}`;
};

export const dateToString = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const newDate =
    `${date.getFullYear()}.${convertToZeroBasedFormat(month)}.${convertToZeroBasedFormat(day)}`;
  return newDate;
};

export const monthDayToString = (date) => {
  const day = date.getDate();

  return `${MONTH_NAMES[date.getMonth()]} ${convertToZeroBasedFormat(day)}`;
};

export const timeToString = (date) => {
  const hours = convertToZeroBasedFormat(date.getHours());
  const minutes = convertToZeroBasedFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const fullDateToString = (date) => {
  // 2019-03-18T11:00
  const month = date.getMonth() + 1;

  return `${date.getFullYear()}-${convertToZeroBasedFormat(month)}-${convertToZeroBasedFormat(date.getDate())}T${timeToString(date)}`;
};

export const shortYearDateToString = (date) => {
  // для формы редактирования
  const day = convertToZeroBasedFormat(date.getDate());
  const month = convertToZeroBasedFormat(date.getMonth() + 1);
  const year = convertToZeroBasedFormat(date.getFullYear());
  const hours = convertToZeroBasedFormat(date.getHours());
  const minutes = convertToZeroBasedFormat(date.getMinutes());

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
    delta += `${convertToZeroBasedFormat(days)}D `;
  }

  if (hours > 0) {
    delta += `${convertToZeroBasedFormat(hours)}H `;
  }

  delta += `${convertToZeroBasedFormat(minutes)}M`;

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
  `${convertToZeroBasedFormat(date1.getDate())} ${MONTH_NAMES[date1.getMonth()].toUpperCase()}`;
