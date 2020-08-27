import AbstractView from "./abstract.js";

const createOffersTemplate = (offers) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map((offer) => `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${offer.label}"
          type="checkbox"
          name="event-offer-${offer.label}"
          ${offer.isAccepted ? `checked` : ``}
        >
        <label class="event__offer-label" for="event-offer-${offer.label}">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join(``)}

    </div>
  </section>`;

export default class OffersContainer extends AbstractView {
  constructor(offers) {
    super();
    this._offers = offers;

    this._checkOffersHandler = this._checkOffersHandler.bind(this);
  }

  getTemplate() {
    return createOffersTemplate(this._offers);
  }

  _checkOffersHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `INPUT`) {
      this._callback.checkOffers();
    }
  }

  setCheckOffersHandler(callback) {
    this._callback.checkOffers = callback;
    this.getElement().addEventListener(`change`, this._checkOffersHandler);
  }
}
