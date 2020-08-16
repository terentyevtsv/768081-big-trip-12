import AbstractView from "./abstract.js";

const createSelectedOffersContainer = () =>
  `<ul class="event__selected-offers"></ul>`;

export default class SelectedOffersContainer extends AbstractView {
  getTemplate() {
    return createSelectedOffersContainer();
  }
}
