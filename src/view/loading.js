import AbstractView from "./abstract.js";

const createLoadingTemplate = (message) =>
  `<p class="trip-events__msg">${message}</p>`;

export default class Loading extends AbstractView {
  constructor(message = `Loading...`) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createLoadingTemplate(this._message);
  }
}
