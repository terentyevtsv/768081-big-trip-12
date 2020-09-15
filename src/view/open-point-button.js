import AbstractView from "./abstract.js";

const createOpenPointButtonTemplate = () =>
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

export default class OpenPointButton extends AbstractView {
  getTemplate() {
    return createOpenPointButtonTemplate();
  }
}
