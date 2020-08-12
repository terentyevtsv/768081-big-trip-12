import {dateToString, monthDayToString, createElement} from "../common.js";

const createTripDaysItemTemplate = (date, index) =>
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${dateToString(date)}">${monthDayToString(date)}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>`;

export default class TripDaysItem {
  constructor(date, number) {
    this._date = date;
    this._number = number;

    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._date, this._number);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
