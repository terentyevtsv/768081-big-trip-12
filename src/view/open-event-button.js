import {createElement} from "../common.js";

const createOpenEventButtonTemplate = () =>
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

export default class OpenEventButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createOpenEventButtonTemplate();
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
