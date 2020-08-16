import {timeToString, fullDateToString, getDatesDelta} from "../utils/formats.js";
import AbstractView from "./abstract.js";

const createReadingEventContentTemplate = (evt) =>
  `<div class="event">
    <div class="event__type">
      <img
        class="event__type-icon"
        width="42"
        height="42"
        src="${evt.eventType.image}"
        alt="Event type icon"
      >
    </div>
    <h3 class="event__title">${evt.eventType.name} ${evt.eventType.eventGroup} ${evt.city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time
          class="event__start-time"
          datetime="${fullDateToString(evt.timeInterval.leftLimitDate)}"
        >${timeToString(evt.timeInterval.leftLimitDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="${fullDateToString(evt.timeInterval.rightLimitDate)}">${timeToString(evt.timeInterval.rightLimitDate)}</time>
      </p>
      <p class="event__duration">${getDatesDelta(evt.timeInterval.leftLimitDate, evt.timeInterval.rightLimitDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${evt.price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
  </div>`;

export default class ReadingEventContent extends AbstractView {
  constructor(evt) {
    super();
    this._evt = evt;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createReadingEventContentTemplate(this._evt);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._editClickHandler);
  }
}
