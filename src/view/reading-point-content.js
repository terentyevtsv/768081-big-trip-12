import {timeToString, fullDateToString, getDatesDelta} from "../utils/formats.js";
import AbstractView from "./abstract.js";

const createReadingPointContentTemplate = (point) =>
  `<div class="event">
    <div class="event__type">
      <img
        class="event__type-icon"
        width="42"
        height="42"
        src="${point.eventType.image}"
        alt="Event type icon"
      >
    </div>
    <h3 class="event__title">${point.eventType.name} ${point.eventType.pointGroup} ${point.city}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time
          class="event__start-time"
          datetime="${fullDateToString(point.timeInterval.leftLimitDate)}"
        >${timeToString(point.timeInterval.leftLimitDate)}</time>
        &mdash;
        <time class="event__end-time" datetime="${fullDateToString(point.timeInterval.rightLimitDate)}">${timeToString(point.timeInterval.rightLimitDate)}</time>
      </p>
      <p class="event__duration">${getDatesDelta(point.timeInterval.leftLimitDate, point.timeInterval.rightLimitDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
  </div>`;

export default class ReadingPointContent extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createReadingPointContentTemplate(this._point);
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
