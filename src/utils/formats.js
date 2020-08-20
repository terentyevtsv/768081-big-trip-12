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
  let hours = zeroBasedFormat(date.getHours());
  let minutes = zeroBasedFormat(date.getMinutes());

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
  const year = zeroBasedFormat(date.getFullYear() % 100);
  const hours = zeroBasedFormat(date.getHours());
  const minutes = zeroBasedFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getDatesDelta = (date1, date2) => {
  let a = moment([
    date1.getFullYear(), date1.getMonth(), date1.getDate(),
    date1.getHours(), date1.getMinutes(), date1.getSeconds()
  ]);
  const b = moment([
    date2.getFullYear(), date2.getMonth(), date2.getDate(),
    date2.getHours(), date2.getMinutes(), date2.getSeconds()
  ]);

  let duration = moment.duration(b.diff(a));
  const days = Math.floor(duration.asDays());
  a = a.add(days, `days`);

  duration = moment.duration(b.diff(a));
  const hours = Math.floor(duration.asHours());

  a = a.add(hours, `hours`);
  duration = moment.duration(b.diff(a));
  const minutes = Math.floor(duration.asMinutes());

  // 01D 02H 30M
  let delta = ``;
  if (days > 0) {
    delta += `${zeroBasedFormat(days)}D `;
  }

  if (hours > 0) {
    delta += `${zeroBasedFormat(hours)}H `;
  }

  if (minutes > 0) {
    delta += `${zeroBasedFormat(minutes)}M`;
  }

  delta = delta.trimRight();

  return delta;
};

export const getDateForInterval = (date1) =>
  `${zeroBasedFormat(date1.getDate())} ${MONTH_NAMES[date1.getMonth()].toUpperCase()}`;
