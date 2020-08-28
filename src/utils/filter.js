import {FilterType} from "../const.js";

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((evt) => evt.timeInterval.leftLimitDate > new Date()),
  [FilterType.PAST]: (events) => events.filter((evt) => evt.timeInterval.rightLimitDate < new Date())
};
