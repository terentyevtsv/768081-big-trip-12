import {FilterType} from "../const.js";

export default class EventsFiltration {
  constructor(events) {
    this._events = events;
    this._nowDate = new Date();
  }

  getEvents(filterType) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        return this._events;

      case FilterType.FUTURE:
        return this._events.filter((evt) => evt.timeInterval.leftLimitDate > this._nowDate);

      case FilterType.PAST:
        return this._events.filter((evt) => evt.timeInterval.rightLimitDate < this._nowDate);

      default:
        throw new Error(`Неизвестный тип фильтра!`);
    }
  }
}
