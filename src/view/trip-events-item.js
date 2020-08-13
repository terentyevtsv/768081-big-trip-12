import {createElement} from "../common.js";

const createTripEventsItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class TripEventsItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsItemTemplate();
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
