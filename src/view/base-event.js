import {shortYearDateToString} from "../utils/formats.js";
import {EventGroup} from "../const.js";
import {eventTypes, cities} from "../mock/event.js";
import SmartView from "./smart.js";

const createEmptyEventTemplate = (evt, isNewEvent) =>
  `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="${evt.eventType.image}"
            alt="Event type icon"
          >
        </label>
        <input
          class="event__type-toggle  visually-hidden"
          id="event-type-toggle-1"
          type="checkbox"
        >

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            ${eventTypes
              .filter((eventType) => eventType.eventGroup === EventGroup.MOVEMENT)
              .map((eventType) => `<div class="event__type-item">
                <input
                  id="event-type-${eventType.value}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${eventType.value}"
                  ${eventType.value === evt.eventType.value ? `checked` : ``}
                >
                <label
                  class="event__type-label  event__type-label--${eventType.value}"
                  for="event-type-${eventType.value}-1"
                >
                ${eventType.name}
                </label>
              </div>`).join(``)}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${eventTypes
              .filter((eventType) => eventType.eventGroup === EventGroup.PLACE)
              .map((eventType) => `<div class="event__type-item">
                <input
                  id="event-type-${eventType.value}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${eventType.value}"
                  ${eventType.value === evt.eventType.value ? `checked` : ``}
                >
                <label
                  class="event__type-label  event__type-label--${eventType.value}"
                  for="event-type-${eventType.value}-1"
                >
                ${eventType.name}
                </label>
              </div>`).join(``)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${`${evt.eventType.name} ${evt.eventType.eventGroup}`}
        </label>
        <input
          class="event__input  event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${evt.city}"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
          ${Array.from(cities.keys()).map((city) => `<option value="${city}"></option>`).join(``)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input
          class="event__input  event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${shortYearDateToString(evt.timeInterval.leftLimitDate)}"
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input
          class="event__input  event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${shortYearDateToString(evt.timeInterval.rightLimitDate)}"
        >
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input  event__input--price"
          id="event-price-1"
          type="text"
          name="event-price"
          value="${evt.price}"
        >
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      ${isNewEvent
    ? `<button class="event__reset-btn" type="reset">Cancel</button>`
    : `<button class="event__reset-btn" type="reset">Delete</button>

      <input
        id="event-favorite-1"
        class="event__favorite-checkbox  visually-hidden"
        type="checkbox"
        name="event-favorite"
        ${evt.isFavorite ? `checked` : ``}
      >
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`}
    </header>
  </form>`;

export default class BaseEvent extends SmartView {
  constructor(evt, isNewEvent) {
    super();
    this._evt = evt;
    this._isNewEvent = isNewEvent;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEmptyEventTemplate(this._evt, this._isNewEvent);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._evt);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  // обработчик клика для звёздочки.
  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  // метод для установки обработчика клика для звёздочки.
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _setInnerHandlers() {
    // this.getElement()
    //   .querySelector(`.card__date-deadline-toggle`)
    //   .addEventListener(`click`, this._dueDateToggleHandler);
    // this.getElement()
    //   .querySelector(`.card__repeat-toggle`)
    //   .addEventListener(`click`, this._repeatingToggleHandler);
    // this.getElement()
    //   .querySelector(`.card__text`)
    //   .addEventListener(`input`, this._descriptionInputHandler);

    // if (this._data.isRepeating) {
    //   this.getElement()
    //     .querySelector(`.card__repeat-days-inner`)
    //     .addEventListener(`change`, this._repeatingChangeHandler);
    // }

    // this.getElement()
    //   .querySelector(`.card__colors-wrap`)
    //   .addEventListener(`change`, this._colorChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }
}
