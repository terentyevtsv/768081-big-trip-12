import BaseEventView from "../view/base-event.js";
import {renderEventsOptions, renderFormState} from "../utils/editable-event.js";
import {render, AddedComponentPosition, replace, remove} from "../utils/render.js";
import {UserAction} from "../const.js";
import PointsModel from "../model/points.js";
import EventDetailsView from "../view/event-details.js";

const EMPTY_EVENT_INDEX = 0;

export default class EventNew {
  constructor(
      eventListContainer,
      offersModel,
      citiesModel,
      pointsModel,
      newEventButtonView,
      changeData,
      changeMode,
      api
  ) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._citiesModel = citiesModel;
    this._pointsModel = pointsModel;
    this._newEventButtonView = newEventButtonView;
    this._api = api;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._initBaseEvent = this._initBaseEvent.bind(this);
    this._changeOffersListHandler = this._changeOffersListHandler.bind(this);
    this._event = this._getDefaultEvent();

    this._offers = [];

    for (const offer of this._event.offers) {
      this._offers.push(offer.isAccepted);
    }
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    this._newEventButtonView.inverseEnabled();
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
    renderFormState(
        this._eventEditComponent,
        this._offersContainerView,
        this._eventDetailsView, {
          isDisabled: true,
          isSaving: true
        });
    for (let i = 0; i < this._offers.length; ++i) {
      evt.offers[i].isAccepted = this._offers[i];
    }

    const destinationInfo = this._pointsModel.getDestinationInfo(evt.city);
    const point = PointsModel.adaptToServer(evt, destinationInfo);

    this._api.createPoint(point)
      .then((response) => {
        renderFormState(
            this._eventEditComponent,
            this._offersContainerView,
            this._eventDetailsView, {
              isDisabled: false,
              isSaving: false
            }
        );

        this._changeData(
            UserAction.ADD_EVENT,
            Object.assign({id: response.id}, evt)
        );
        this.destroy();
      })
      .catch(() => {
        this._eventEditComponent.shake(() => {
          renderFormState(
              this._eventEditComponent,
              this._offersContainerView,
              this._eventDetailsView, {
                isDisabled: false,
                isSaving: false
              }
          );
        });
      });
  }

  _handleCancelClick() {
    this.destroy();
  }

  // Значения по умолчанию для события при создании события
  _getDefaultEvent() {
    const tmpCities = this._citiesModel.cities;
    const evt = {
      eventType: this._offersModel.eventTypes[EMPTY_EVENT_INDEX],
      city: tmpCities[EMPTY_EVENT_INDEX],
      offers: [],
      destination: this._citiesModel.getDestination(tmpCities[EMPTY_EVENT_INDEX]),
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

    this._offers = [];
    for (let i = 0; i < data.offers.length; i++) {
      this._offers[i] = false;
    }

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
      this._offers[i] = offerElements[i].checked;
    }
  }

  _renderNewEvent(evt) {
    this._eventEditComponent = new BaseEventView(
        evt,
        true,
        this._offersModel,
        this._citiesModel,
        this._initBaseEvent,
        () => render(
            this._eventEditComponent,
            this._eventDetailsView,
            AddedComponentPosition.BEFORE_END
        )
    );

    this._eventDetailsView = new EventDetailsView();
    this._offersContainerView = renderEventsOptions(
        this._eventDetailsView,
        this._eventEditComponent,
        evt,
        this._citiesModel
    );
    if (this._offersContainerView !== null) {
      this._offersContainerView.setCheckOffersHandler(this._changeOffersListHandler);
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
