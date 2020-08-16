import AbstractView from "./abstract.js";

const createOpenEventButtonTemplate = () =>
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

export default class OpenEventButton extends AbstractView {
  getTemplate() {
    return createOpenEventButtonTemplate();
  }
}
