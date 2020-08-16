import AbstractView from "./abstract.js";

const createEventDetailsTemplate = () =>
  `<section class="event__details"></section>`;

export default class EventDetails extends AbstractView {
  getTemplate() {
    return createEventDetailsTemplate();
  }
}
