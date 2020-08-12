import {createElement} from "../common.js";

const createEventsListTemplate = () =>
  `<ul class="trip-events__list"></ul>`;

export default class EventsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventsListTemplate();
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
