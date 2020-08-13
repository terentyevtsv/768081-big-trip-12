import {createElement} from "../common.js";

const createSiteFilterHeaderTemplate = () =>
  `<h2 class="visually-hidden">Filter events</h2>`;

export default class FilterHeader {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteFilterHeaderTemplate();
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
