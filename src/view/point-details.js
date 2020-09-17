import AbstractView from "./abstract.js";

const createPointDetailsTemplate = () =>
  `<section class="event__details"></section>`;

export default class PointDetails extends AbstractView {
  getTemplate() {
    return createPointDetailsTemplate();
  }
}
