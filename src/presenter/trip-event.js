import ReadingEventContentView from "../view/reading-event-content.js";
import BaseEventView from "../view/base-event.js";
import EventDetailsView from "../view/event-details.js";
import {AddedComponentPosition} from "../utils/render.js";
import {render, replace, remove} from "../utils/render.js";
import OffersContainerView from "../view/offers.js";
import {cities, eventTypes, getOffers} from "../mock/event.js";
import DestinationView from "../view/destination.js";
import SelectedOffersContainerView from "../view/selected-offers-container.js";
import OfferItemView from "../view/offer-item.js";
import OpenEventButtonView from "../view/open-event-button.js";

const EMPTY_EVENT_INDEX = 0;
const MAX_OFFERS_COUNT = 3;

export default class TripEvent {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(evt) {
    const isNewEvent = evt === null;
    evt = evt || this._getDefaultEvent();

    this._event = evt;

    // Предыдущие редактируемый и компонент для чтения у точки маршрута
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    // Собранные (не подключенные к DOM) пара текущих компонентов с новой моделью
    this._renderReadOnlyEvent(evt);
    this._renderEditableEvent(evt, isNewEvent);

    // Подписка к событиям компонентов
    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null ||
        prevEventEditComponent === null) {
      // Изначально отрисовка компонента для чтения
      render(
          this._eventListContainer,
          this._eventComponent,
          AddedComponentPosition.BEFORE_END
      );
      return;
    }

    if (this._eventListContainer.getElement().contains(prevEventComponent.getElement())) {
      // Обновление компонента для чтения
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevEventEditComponent.getElement())) {
      // Обновление компонента для записи
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    // Отчистка памяти от старых компонентов
    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _renderOffers(evt) {
    // Контейнер предложений для текущего события
    const selectedOffersContainer = new SelectedOffersContainerView();
    render(
        this._eventComponent,
        selectedOffersContainer,
        AddedComponentPosition.BEFORE_END
    );

    // Заполнение контейнера предложений текущего события
    let cnt = 0; // счетчик предложений для короткой записи события
    for (let k = 0; k < evt.offers.length; ++k) {
      if (evt.offers[k].isAccepted) {
        ++cnt;
        if (cnt > MAX_OFFERS_COUNT) {
          break;
        }

        render(
            selectedOffersContainer,
            new OfferItemView(evt.offers[k]),
            AddedComponentPosition.BEFORE_END
        );
      }
    }
  }

  // Значения по умолчанию для события при создании события
  _getDefaultEvent() {
    const tmpCities = Array.from(cities.keys());
    const evt = {
      eventType: eventTypes[EMPTY_EVENT_INDEX],
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

    const offers = getOffers(evt.eventType);
    for (let i = 0; i < offers.length; i++) {
      evt.offers[i] = {
        name: offers[i].name,
        price: offers[i].price,
        isAccepted: false
      };
    }

    return evt;
  }

  _renderReadOnlyEvent(evt) {
    this._eventComponent = new ReadingEventContentView(evt);

    // Отрисовка краткого списка предложений
    this._renderOffers(evt);

    // В конце элемента для чтения кнопка открытия события
    render(
        this._eventComponent,
        new OpenEventButtonView(),
        AddedComponentPosition.BEFORE_END
    );
  }

  _renderEditableEvent(evt, isNewEvent) {
    this._eventEditComponent = new BaseEventView(evt, isNewEvent);

    const eventDetailsView = new EventDetailsView();

    render(
        this._eventEditComponent,
        eventDetailsView,
        AddedComponentPosition.BEFORE_END
    );

    // Оферы и места
    if (evt.offers.length > 0 || evt.destination !== null) {
      if (evt.offers.length > 0) {
        render(
            eventDetailsView,
            new OffersContainerView(evt.offers),
            AddedComponentPosition.BEFORE_END
        );
      }

      const destination = cities.get(evt.city);
      if (destination !== null) {
        render(
            eventDetailsView,
            new DestinationView(destination),
            AddedComponentPosition.BEFORE_END
        );
      }
    } else {
      eventDetailsView.remove();
    }
  }

  // Подмена события на форму редактирования
  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  // Подмена формы редактирования на событие
  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(evt) {
    this._changeData(evt);
    this._replaceFormToEvent();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleFavoriteClick() {
    // Вызов метода изменения данных в обработчике клика по звездочке
    this._changeData(
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }
}
