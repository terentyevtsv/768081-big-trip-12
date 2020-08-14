import AbstractView from "./abstract.js";

const createEventsPlanContainerTemplate = () =>
  `<ul class="trip-days"></ul>`;

export default class EventsPlanContainer extends AbstractView {
  getTemplate() {
    return createEventsPlanContainerTemplate();
  }
}
