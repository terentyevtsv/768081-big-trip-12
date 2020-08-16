import {render, AddedComponentPosition, replace} from "../utils/render.js";
import NoEventView from "../view/no-event.js";
import SortingView from "../view/sorting.js";
import EventsPlanContainerView from "../view/events-plan-container.js";
import {cities, eventTypes, getOffers} from "../mock/event.js";
import TripDaysItemView from "../view/trip-days-item.js";
import EventsListView from "../view/events-list.js";
import TripEventsItemView from "../view/trip-events-item.js";
import ReadingEventContentView from "../view/reading-event-content.js";
import BaseEventView from "../view/base-event.js";
import SelectedOffersContainerView from "../view/selected-offers-container.js";
import OfferItemView from "../view/offer-item.js";
import OpenEventButtonView from "../view/open-event-button.js";
import EventDetailsView from "../view/event-details.js";
import OffersContainerView from "../view/offers.js";
import DestinationView from "../view/destination.js";
import {SortType} from "../const.js";

const EMPTY_EVENT_INDEX = 0;
const MAX_OFFERS_COUNT = 3;

const getDifference = function (timeInterval) {
  return (
    timeInterval.rightLimitDate.getTime() -
    timeInterval.leftLimitDate.getTime()
  );
};

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._currentSortType = SortType.EVENT;
    this._noEventView = new NoEventView();
    this._sortingView = new SortingView();
    this._eventsPlanContainerView = new EventsPlanContainerView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  get planDateEventsMap() {
    return this._planDateEventsMap;
  }

  init(events) {
    this._events = events;
    this._planDateEventsMap = this._getMapDates();
    this._renderEventsPlan();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    const mapDates = this._getMapDates();
    this._renderEvents(mapDates);
  }

  // Формирование структуры событий по датам
  _getMapDates() {
    const mapDates = new Map();

    if (this._currentSortType === SortType.EVENT) {
      // Обычный порядок
      const datesSet = new Set();

      // Формируем список дат, по которым будут группироваться события
      this._events.forEach((evt) => {
        const date = new Date(evt.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        datesSet.add(date.getTime());
      });

      // Сортируем даты в порядке возрастания
      const dates = Array.from(datesSet)
        .sort((a, b) => a - b);

      // Раскидываем события по датам
      dates.forEach((date) => mapDates.set(date, []));

      this._events.forEach((evt) => {
        const date = new Date(evt.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        mapDates.get(date.getTime()).push(evt);
      });

      Array.from(mapDates.keys()).forEach((mapDateKey) => mapDates.get(mapDateKey)
        .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                        b.timeInterval.leftLimitDate.getTime())
      );
      return mapDates;
    }

    const tmpDate = new Date();
    const events = this._events.slice();
    if (this._currentSortType === SortType.TIME) {
      // Порядок с сортировкой по времени события
      events.sort((evt1, evt2) => getDifference(evt2.timeInterval) -
                                  getDifference(evt1.timeInterval));
      mapDates.set(tmpDate, events);

      return mapDates;
    }

    // Порядок с сортировкой по цене
    events.sort((evt1, evt2) => evt2.price - evt1.price);
    mapDates.set(tmpDate, events);

    return mapDates;
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

  _renderSort() {
    // Метод для рендеринга сортировки
    // Сортировка
    render(
        this._tripEventsContainer,
        this._sortingView,
        AddedComponentPosition.BEFORE_END
    );

    this._sortingView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEditableEvent(evt, isNewEvent) {
    const eventView = new BaseEventView(evt, isNewEvent);
    const eventDetailsView = new EventDetailsView();

    render(
        eventView,
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

    return eventView;
  }

  _renderOffers(readingEventContentView, evt) {
    // Контейнер предложений для текущего события
    const selectedOffersContainer = new SelectedOffersContainerView();
    render(
        readingEventContentView,
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

  _renderEvent(evt, eventsListView) {
    const isNewEvent = evt === null;
    evt = evt || this._getDefaultEvent();

    // Контейнер события
    const tripEventsItemView = new TripEventsItemView();
    render(
        eventsListView,
        tripEventsItemView,
        AddedComponentPosition.BEFORE_END
    );

    // Содержимое события (для чтения)
    const readingEventContentView = new ReadingEventContentView(evt);

    // Форма добавление/редактирования
    const editableEventContentView = this._renderEditableEvent(evt, isNewEvent);

    // Подмена события на форму редактирования
    const replaceEventToForm = () => {
      replace(editableEventContentView, readingEventContentView);
    };

    // Подмена формы редактирования на событие
    const replaceFormToEvent = () => {
      replace(readingEventContentView, editableEventContentView);
    };

    const onEscKeyDown = (evt1) => {
      if (evt1.key === `Escape` || evt1.key === `Esc`) {
        evt1.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // Отрисовка события
    render(
        tripEventsItemView,
        readingEventContentView,
        AddedComponentPosition.BEFORE_END
    );

    // Отрисовка краткого списка предложений
    this._renderOffers(readingEventContentView, evt);

    // В конце элемента для чтения кнопка открытия события
    render(
        readingEventContentView,
        new OpenEventButtonView(),
        AddedComponentPosition.BEFORE_END
    );

    // Подписка на кнопку открытия формы
    readingEventContentView.setEditClickHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Подписка на отправку формы
    editableEventContentView.setFormSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
  }

  _renderEvents(mapDates) {
    this._eventsPlanContainerView.getElement().innerHTML = ``;

    let index = 0;
    for (const mapDateKey of mapDates.keys()) {
      // Какая-то дата путешествия
      const date = new Date(mapDateKey);

      // Отрисовка очередной даты
      const tripDaysItemView = new TripDaysItemView(date, index++, this._currentSortType);
      render(
          this._eventsPlanContainerView,
          tripDaysItemView,
          AddedComponentPosition.BEFORE_END
      );

      const eventsListView = new EventsListView();
      render(
          tripDaysItemView,
          eventsListView,
          AddedComponentPosition.BEFORE_END
      );

      // события даты сортируем по дате начала
      const tmpEvents = mapDates.get(mapDateKey);
      // Цикл по всем событиям данной даты
      for (let j = 0; j < tmpEvents.length; ++j) {
        this._renderEvent(tmpEvents[j], eventsListView);
      }
    }
  }

  _renderNoEvents() {
    // Метод для рендеринга заглушки
    render(
        this._tripEventsContainer,
        this._noEventView,
        AddedComponentPosition.BEFORE_END
    );
  }

  _renderEventsPlan() {
    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();

    render(
        this._tripEventsContainer,
        this._eventsPlanContainerView,
        AddedComponentPosition.BEFORE_END
    );
    this._renderEvents(this._planDateEventsMap);
  }
}
