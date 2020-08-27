import BaseEventView from "../view/base-event.js";
import {renderEventsOptions} from "../utils/editable-event.js";
import {render, AddedComponentPosition, replace, remove} from "../utils/render.js";
import {cities, generateId} from "../mock/event.js";
import {UserAction} from "../const.js";

const EMPTY_EVENT_INDEX = 0;

export default class EventNew {
  constructor(eventListContainer, offersModel, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._initBaseEvent = this._initBaseEvent.bind(this);
    this._changeOffersListHandler = this._changeOffersListHandler.bind(this);
    this._event = this._getDefaultEvent();
    this._offers = this._event.offers.slice();
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(evt) {
    for (let i = 0; i < this._offers.length; ++i) {
      evt.offers[i].isAccepted = this._offers[i].isAccepted;
    }
    this._changeData(
        UserAction.ADD_EVENT,
        // Пока у нас нет сервера, который бы после сохранения
        // выдывал честный id задачи, нам нужно позаботиться об этом самим
        Object.assign({id: generateId()}, evt)
    );
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  // Значения по умолчанию для события при создании события
  _getDefaultEvent() {
    const tmpCities = Array.from(cities.keys());
    const evt = {
      eventType: this._offersModel.eventTypes[EMPTY_EVENT_INDEX],
      city: tmpCities[EMPTY_EVENT_INDEX],
      offers: [],
      destination: cities.get(tmpCities[EMPTY_EVENT_INDEX]),
      isFavorite: false,
      price: 0
    };

    const date = new Date();
    date.setHours(0, 0, 0);

    evt.timeInterval = {
      leftLimitDate: date,
      rightLimitDate: date
    };

    const offers = this._offersModel.getOffers(evt.eventType);
    for (let i = 0; i < offers.length; i++) {
      evt.offers[i] = {
        name: offers[i].name,
        price: offers[i].price,
        label: offers[i].label,
        isAccepted: false
      };
    }

    return evt;
  }

  _initBaseEvent(data) {
    const prevEventEditComponent = this._eventEditComponent;

    this._renderNewEvent(data);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleCancelClick);

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    replace(this._eventEditComponent, prevEventEditComponent);
    remove(prevEventEditComponent);
  }

  _changeOffersListHandler() {
    const offerElements = this._eventEditComponent.getElement()
      .querySelectorAll(`.event__offer-checkbox`);
    for (let i = 0; i < offerElements.length; ++i) {
      this._offers[i].isAccepted = offerElements[i].checked;
    }
  }

  _renderNewEvent(evt) {
    this._eventEditComponent = new BaseEventView(
        evt,
        true,
        this._offersModel,
        this._initBaseEvent
    );

    const offersContainerView = renderEventsOptions(this._eventEditComponent, evt);
    if (offersContainerView !== null) {
      offersContainerView.setCheckOffersHandler(this._changeOffersListHandler);
    }

    render(
        this._eventListContainer,
        this._eventEditComponent,
        AddedComponentPosition.BEFORE_END
    );
  }

  init() {
    this._renderNewEvent(this._event);

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleCancelClick);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }
}
