import {createElement} from "../common.js";

const createEventsPlanContainerTemplate = () =>
  `<ul class="trip-days"></ul>`;

export default class EventsPlanContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventsPlanContainerTemplate();
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
