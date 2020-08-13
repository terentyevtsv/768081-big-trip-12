import {createElement} from "../common.js";

const createOfferItemTemplate = (offer) =>
  `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`;

export default class OfferItem {
  constructor(offer) {
    this._offer = offer;
    this._element = null;
  }

  getTemplate() {
    return createOfferItemTemplate(this._offer);
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
