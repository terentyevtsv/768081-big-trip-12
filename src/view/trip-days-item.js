import {dateToString, monthDayToString} from "../utils/formats.js";
import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createTripDaysItemTemplate = (date, index) =>
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${dateToString(date)}">${monthDayToString(date)}</time>
    </div>
  </li>`;

const createEmptyTripDaysItemTemplate = () =>
  `<li class="trip-days__item  day">
    <div class="day__info"></div>
  </li>`;

export default class TripDaysItem extends AbstractView {
  constructor(date, number, sortType) {
    super();
    this._date = date;
    this._number = number;
    this._sortType = sortType;
  }

  getTemplate() {
    return this._sortType === SortType.EVENT
      ? createTripDaysItemTemplate(this._date, this._number)
      : createEmptyTripDaysItemTemplate();
  }
}
