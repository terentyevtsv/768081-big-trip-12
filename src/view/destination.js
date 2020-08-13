import {createElement} from "../common";

const createDestinationTemplate = (destination) =>
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.photos
          .map((photo) => `<img
                            class="event__photo"
                            src="${photo}"
                            alt="Event photo"
                          >`)
          .join(``)}
      </div>
    </div>
  </section>`;

export default class Destination {
  constructor(destination) {
    this._destination = destination;
    this._element = null;
  }

  getTemplate() {
    return createDestinationTemplate(this._destination);
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
