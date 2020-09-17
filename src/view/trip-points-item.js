import AbstractView from "./abstract.js";

const createTripPointsItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class TripPointsItem extends AbstractView {
  getTemplate() {
    return createTripPointsItemTemplate();
  }
}
