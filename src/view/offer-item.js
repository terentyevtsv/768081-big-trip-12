import AbstractView from "./abstract.js";

const createOfferItemTemplate = (offer) =>
  `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`;

export default class OfferItem extends AbstractView {
  constructor(offer) {
    super();
    this._offer = offer;
  }

  getTemplate() {
    return createOfferItemTemplate(this._offer);
  }
}
