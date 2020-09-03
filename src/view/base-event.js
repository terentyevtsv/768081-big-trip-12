import {shortYearDateToString} from "../utils/formats.js";
import {EventGroup} from "../const.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEmptyEventTemplate = (
    evt,
    isNewEvent,
    eventTypes,
    cities
) =>
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
          ${evt.isDisabled ? `disabled` : ``}
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
          ${evt.isDisabled ? `disabled` : ``}
        >
        <datalist id="destination-list-1">
          ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
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
          ${evt.isDisabled ? `disabled` : ``}
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
          ${evt.isDisabled ? `disabled` : ``}
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
          type="number"
          name="event-price"
          value="${evt.price}"
          ${evt.isDisabled ? `disabled` : ``}
        >
      </div>

      <button
        class="event__save-btn  btn  btn--blue"
        type="submit"
        ${evt.isDisabled ? `disabled` : ``}
      >
        ${evt.isSaving ? `Saving` : `Save`}
      </button>
      ${isNewEvent
    ? `<button
        class="event__reset-btn" type="reset"
        ${evt.isDisabled ? `disabled` : ``}
      >
        Cancel
      </button>`
    : `<button
        class="event__reset-btn"
        type="reset"
        ${evt.isDisabled ? `disabled` : ``}
      >
        ${evt.isDeleting ? `Deleting` : `Delete`}
      </button>

      <input
        id="event-favorite-1"
        class="event__favorite-checkbox  visually-hidden"
        type="checkbox"
        name="event-favorite"
        ${evt.isFavorite ? `checked` : ``}
        ${evt.isDisabled ? `disabled` : ``}
      >
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button
        class="event__rollup-btn"
        type="button"
        ${evt.isDisabled ? `disabled` : ``}
      >
        <span class="visually-hidden">Open event</span>
      </button>`}
    </header>
  </form>`;

export default class BaseEvent extends SmartView {
  constructor(evt, isNewEvent, offersModel, citiesModel, init) {
    super();

    this._offersModel = offersModel;

    this._citiesModel = citiesModel;
    this._cityNames = new Set(this._citiesModel.cities);

    this._fromDatepicker = null;
    this._toDatepicker = null;

    this._data = BaseEvent.parseEventToData(evt);
    this._isNewEvent = isNewEvent;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._leftDateTimeChangeHandler = this._leftDateTimeChangeHandler.bind(this);
    this._rightDateTimeChangeHandler = this._rightDateTimeChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._init = init;

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
    this._setPriceChangeHandler();
  }

  getTemplate() {
    return createEmptyEventTemplate(
        this._data,
        this._isNewEvent,
        this._offersModel.eventTypes,
        this._citiesModel.cities
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }

  // обработчик клика для звёздочки.
  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);

    this._init(this._data);
    this._callback.favoriteClick();
  }

  updateOffers(offers) {
    const tmpOffers = [];
    for (let i = 0; i < this._data.offers.length; ++i) {
      tmpOffers[i] = {
        isAccepted: offers[i],
        name: this._data.offers[i].name,
        price: this._data.offers[i].price,
        label: this._data.offers[i].label,
      };
    }

    this.updateData({offers: tmpOffers}, true);
  }

  // метод для установки обработчика клика для звёздочки.
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    const tmpEventType = this._offersModel.eventTypes
      .find((eventType) => eventType.value === evt.target.value);
    const tmpOffers = this._offersModel.getOffers(tmpEventType);
    this.updateData({
      eventType: tmpEventType,
      offers: tmpOffers
    },
    true);

    this._init(this._data);
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    if (this._cityNames.has(evt.target.value)) {
      this.updateData({
        city: evt.target.value
      },
      true);

      this._init(this._data);
    }
  }

  // обработчик изменения цены.
  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10)
    },
    true);
  }

  // метод для установки обработчика клика для звёздочки.
  _setPriceChangeHandler() {
    this.getElement().querySelector(`#event-price-1`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  reset(evt) {
    if (evt !== null) {
      this.updateData(
          BaseEvent.parseEventToData(evt)
      );
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement()
      .querySelector(`#event-destination-1`)
      .addEventListener(`input`, this._cityChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _leftDateTimeChangeHandler(selectedDates) {
    const selectedDate = selectedDates[0];

    const tmpTimeInterval = {
      leftLimitDate: selectedDate,
      rightLimitDate: this._data.timeInterval.rightLimitDate
    };
    this.updateData({
      timeInterval: tmpTimeInterval
    }, true);

    this._toDatepicker.config.minDate = selectedDate;
  }

  _rightDateTimeChangeHandler(selectedDates) {
    const selectedDate = selectedDates[0];

    const tmpTimeInterval = {
      leftLimitDate: this._data.timeInterval.leftLimitDate,
      rightLimitDate: selectedDate
    };
    this.updateData({
      timeInterval: tmpTimeInterval
    }, true);

    this._fromDatepicker.config.maxDate = selectedDate;
  }

  _setFromDatepicker() {
    if (this._fromDatepicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._fromDatepicker.destroy();
      this._fromDatepicker = null;
    }

    // flatpickr есть смысл инициализировать только в случае,
    // если поле выбора даты доступно для заполнения
    this._fromDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          maxDate: this._data.timeInterval.rightLimitDate,
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          allowInput: false,
          dateFormat: `d/m/y H:i`,
          onChange: this._leftDateTimeChangeHandler
        }
    );
  }

  _setToDatepicker() {
    if (this._toDatepicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._toDatepicker.destroy();
      this._toDatepicker = null;
    }

    // flatpickr есть смысл инициализировать только в случае,
    // если поле выбора даты доступно для заполнения
    this._toDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          minDate: this._data.timeInterval.leftLimitDate,
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          allowInput: false,
          dateFormat: `d/m/y H:i`,
          onChange: this._rightDateTimeChangeHandler
        }
    );
  }

  static parseEventToData(evt) {
    return Object.assign(
        {},
        evt,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }
}
