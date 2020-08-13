import {createElement} from "../common.js";

const createSelectedOffersContainer = () =>
  `<ul class="event__selected-offers"></ul>`;

export default class SelectedOffersContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSelectedOffersContainer();
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
