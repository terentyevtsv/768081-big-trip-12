import AbstractView from "./abstract.js";

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

export default class Destination extends AbstractView {
  constructor(destination) {
    super();
    this._destination = destination;
  }

  getTemplate() {
    return createDestinationTemplate(this._destination);
  }
}
