import {shortYearDateToString} from "../utils/formats.js";
import {PointGroup} from "../const.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const RADIX = 10;

const createEmptyPointTemplate = (
    point,
    isNewPoint,
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
            src="${point.eventType.image}"
            alt="Event type icon"
          >
        </label>
        <input
          class="event__type-toggle  visually-hidden"
          id="event-type-toggle-1"
          type="checkbox"
          ${point.isDisabled ? `disabled` : ``}
        >

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            ${eventTypes
              .filter((eventType) => eventType.pointGroup === PointGroup.MOVEMENT)
              .map((eventType) => `<div class="event__type-item">
                <input
                  id="event-type-${eventType.value}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${eventType.value}"
                  ${eventType.value === point.eventType.value ? `checked` : ``}
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
              .filter((eventType) => eventType.pointGroup === PointGroup.PLACE)
              .map((eventType) => `<div class="event__type-item">
                <input
                  id="event-type-${eventType.value}-1"
                  class="event__type-input  visually-hidden"
                  type="radio"
                  name="event-type"
                  value="${eventType.value}"
                  ${eventType.value === point.eventType.value ? `checked` : ``}
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
          ${`${point.eventType.name} ${point.eventType.pointGroup}`}
        </label>
        <select
          class="event__input  event__input--destination"
          id="event-destination-1"
          ${point.isDisabled ? `disabled` : ``}
          required
        >
          ${cities
            .map((city) =>
              `<option
                value="${city}"
                ${point.city === city ? `selected` : ``}
              >
                ${city}
              </option>`)
            .join(``)}
        </select>
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
          value="${shortYearDateToString(point.timeInterval.leftLimitDate)}"
          ${point.isDisabled ? `disabled` : ``}
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
          value="${shortYearDateToString(point.timeInterval.rightLimitDate)}"
          ${point.isDisabled ? `disabled` : ``}
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
          min="0"
          ${point.price !== null ? `value="${point.price}"` : ``}
          ${point.isDisabled ? `disabled` : ``}
          required
        >
      </div>

      <button
        class="event__save-btn  btn  btn--blue"
        type="submit"
        ${point.isDisabled ? `disabled` : ``}
      >
        ${point.isSaving ? `Saving` : `Save`}
      </button>
      ${isNewPoint
    ? `<button
        class="event__reset-btn" type="reset"
        ${point.isDisabled ? `disabled` : ``}
      >
        Cancel
      </button>`
    : `<button
        class="event__reset-btn"
        type="reset"
        ${point.isDisabled ? `disabled` : ``}
      >
        ${point.isDeleting ? `Deleting` : `Delete`}
      </button>`}

      <input
        id="event-favorite-1"
        class="event__favorite-checkbox  visually-hidden"
        type="checkbox"
        name="event-favorite"
        ${point.isFavorite ? `checked` : ``}
        ${point.isDisabled ? `disabled` : ``}
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
        ${point.isDisabled ? `disabled` : ``}
      >
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
  </form>`;

export default class BasePoint extends SmartView {
  constructor(point, isNewPoint, offersModel, citiesModel, initialize, renderPointDetails) {
    super();

    this._offersModel = offersModel;

    this._citiesModel = citiesModel;
    this._cityNames = new Set(this._citiesModel.get());

    this._fromDatepicker = null;
    this._toDatepicker = null;
    this._renderPointDetails = renderPointDetails;

    this._data = BasePoint.parsePointToData(point);
    this._isNewPoint = isNewPoint;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._leftDateTimeChangeHandler = this._leftDateTimeChangeHandler.bind(this);
    this._rightDateTimeChangeHandler = this._rightDateTimeChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
    this._initialize = initialize;

    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
    this._setPriceChangeHandler();
  }

  getTemplate() {
    return createEmptyPointTemplate(
        this._data,
        this._isNewPoint,
        this._offersModel.eventTypes,
        this._citiesModel.get()
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;

    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseClickHandler);
  }

  updateOffers(offers) {
    const tempOffers = [];
    for (let i = 0; i < this._data.offers.length; ++i) {
      tempOffers[i] = {
        isAccepted: offers[i],
        name: this._data.offers[i].name,
        price: this._data.offers[i].price,
        label: this._data.offers[i].label,
      };
    }

    this.updateData({offers: tempOffers}, true);
  }

  // метод для установки обработчика клика для звёздочки.
  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  // метод для установки обработчика клика для звёздочки.
  _setPriceChangeHandler() {
    this.getElement().querySelector(`#event-price-1`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  reset(point) {
    if (point !== null) {
      this.updateData(
          BasePoint.parsePointToData(point)
      );
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement()
      .querySelector(`#event-destination-1`)
      .addEventListener(`change`, this._cityChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setFromDatepicker();
    this._setToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.closeClick);
    this._setPriceChangeHandler();
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
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          allowInput: false,
          dateFormat: `d/m/Y H:i`,
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
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          allowInput: false,
          dateFormat: `d/m/Y H:i`,
          onChange: this._rightDateTimeChangeHandler
        }
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  // обработчик клика для звёздочки.
  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);

    this._initialize(this._data);
    this._callback.favoriteClick();
  }

  _formCloseClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    const tempEventType = this._offersModel.eventTypes
      .find((eventType) => eventType.value === evt.target.value);
    const tempOffers = this._offersModel.get(tempEventType);
    this.updateData({
      eventType: tempEventType,
      offers: tempOffers
    },
    true);

    this._initialize(this._data);
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    if (this._cityNames.has(evt.target.value)) {
      this.updateData({
        city: evt.target.value
      },
      true);

      this._initialize(this._data);

      return;
    }
  }

  // обработчик изменения цены.
  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, RADIX)
    },
    true);
  }

  _leftDateTimeChangeHandler(selectedDates) {
    const selectedDate = selectedDates[0];

    let tempTimeInterval = null;
    if (selectedDate === undefined) {
      tempTimeInterval = {
        leftLimitDate: this._data.timeInterval.leftLimitDate,
        rightLimitDate: this._data.timeInterval.rightLimitDate
      };

      this.updateData({
        timeInterval: tempTimeInterval
      }, false);
      this._renderPointDetails();

      return;
    }

    if (selectedDate > this._data.timeInterval.rightLimitDate) {
      tempTimeInterval = {
        leftLimitDate: selectedDate,
        rightLimitDate: selectedDate
      };
    } else {
      tempTimeInterval = {
        leftLimitDate: selectedDate,
        rightLimitDate: this._data.timeInterval.rightLimitDate
      };
    }

    this.updateData({
      timeInterval: tempTimeInterval
    }, false);
    this._renderPointDetails();
  }

  _rightDateTimeChangeHandler(selectedDates) {
    const selectedDate = selectedDates[0];

    let tempTimeInterval = null;
    if (selectedDate === undefined) {
      tempTimeInterval = {
        leftLimitDate: this._data.timeInterval.leftLimitDate,
        rightLimitDate: this._data.timeInterval.rightLimitDate
      };

      this.updateData({
        timeInterval: tempTimeInterval
      }, false);
      this._renderPointDetails();

      return;
    }

    if (selectedDate < this._data.timeInterval.leftLimitDate) {
      tempTimeInterval = {
        leftLimitDate: selectedDate,
        rightLimitDate: selectedDate
      };
    } else {
      tempTimeInterval = {
        leftLimitDate: this._data.timeInterval.leftLimitDate,
        rightLimitDate: selectedDate
      };
    }

    this.updateData({
      timeInterval: tempTimeInterval
    }, false);
    this._renderPointDetails();
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }
}
