import {createElement} from "../common.js";

const createEventDetailsTemplate = () =>
  `<section class="event__details"></section>`;

export default class EventDetails {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventDetailsTemplate();
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
