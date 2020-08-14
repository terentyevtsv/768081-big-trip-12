import {dateToString, monthDayToString} from "../common.js";
import AbstractView from "./abstract.js";

const createTripDaysItemTemplate = (date, index) =>
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${dateToString(date)}">${monthDayToString(date)}</time>
    </div>
  </li>`;

export default class TripDaysItem extends AbstractView {
  constructor(date, number) {
    super();
    this._date = date;
    this._number = number;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._date, this._number);
  }
}
