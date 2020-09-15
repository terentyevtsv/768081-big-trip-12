import AbstractView from "./abstract.js";

const createPointsPlanContainerTemplate = () =>
  `<ul class="trip-days"></ul>`;

export default class PointsPlanContainer extends AbstractView {
  getTemplate() {
    return createPointsPlanContainerTemplate();
  }
}
