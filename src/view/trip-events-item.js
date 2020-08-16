import AbstractView from "./abstract.js";

const createTripEventsItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class TripEventsItem extends AbstractView {
  getTemplate() {
    return createTripEventsItemTemplate();
  }
}
