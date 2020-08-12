import {createElement} from "../common.js";

const createSiteMenuHeaderTemplate = () =>
  `<h2 class="visually-hidden">Switch trip view</h2>`;

export default class SiteMenuHeader {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuHeaderTemplate();
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
