import {createElement, render, AddedComponentPosition} from "../common.js";
import TripEventsItemView from "./trip-events-item.js";
import TripDaysItemView from "./trip-days-item.js";
import EventsListView from "./events-list.js";
import {cities, eventTypes, getOffers} from "../mock/event.js";
import BaseEventView from "./base-event.js";
import SelectedOffersContainerView from "./selected-offers-container.js";
import OpenEventButtonView from "./open-event-button.js";
import ReadingEventContentView from "./reading-event-content.js";
import OfferItemView from "./offer-item.js";

const EMPTY_EVENT_INDEX = 0;
const MAX_OFFERS_COUNT = 3;

const createEventsPlanContainerTemplate = () =>
  `<ul class="trip-days"></ul>`;

export default class EventsPlanContainer {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createEventsPlanContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  // Формирование структуры событий по датам
  getMapDates() {
    const datesSet = new Set();

    this._events.forEach((evt) => {
      const date = new Date(evt.timeInterval.leftLimitDate);
      date.setHours(0, 0, 0, 0);

      datesSet.add(date.getTime());
    });

    const dates = Array.from(datesSet)
      .sort((a, b) => a - b);
    const mapDates = new Map();
    dates.forEach((date) => mapDates.set(date, []));

    this._events.forEach((evt) => {
      const date = new Date(evt.timeInterval.leftLimitDate);
      date.setHours(0, 0, 0, 0);

      mapDates.get(date.getTime()).push(evt);
    });

    return mapDates;
  }

  // Значения по умолчанию для события при создании события
  getDefaultEvent() {
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

  // Отрисовка события и его подмена на форму редактирования
  renderEvent(evt, tripEventsItemView) {
    const isNewEvent = evt === null;
    evt = evt || this.getDefaultEvent();

    // Содержимое события (для чтения)
    const readingEventContentView = new ReadingEventContentView(evt);

    // Форма добавление/редактирования
    const eventView = new BaseEventView(evt, isNewEvent);
    eventView.fillEvent();

    // Подмена события на форму редактирования
    const replaceEventToForm = () => {
      tripEventsItemView.getElement().replaceChild(
          eventView.getElement(),
          readingEventContentView.getElement()
      );
    };

    // Подмена формы редактирования на событие
    const replaceFormToEvent = () => {
      tripEventsItemView.getElement().replaceChild(
          readingEventContentView.getElement(),
          eventView.getElement()
      );
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
        tripEventsItemView.getElement(),
        readingEventContentView.getElement(),
        AddedComponentPosition.BEFORE_END
    );

    // Контейнер предложений для текущего события
    const selectedOffersContainer = new SelectedOffersContainerView();
    render(
        readingEventContentView.getElement(),
        selectedOffersContainer.getElement(),
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
            selectedOffersContainer.getElement(),
            new OfferItemView(evt.offers[k]).getElement(),
            AddedComponentPosition.BEFORE_END
        );
      }
    }

    // В конце элемента для чтения кнопка открытия события
    render(
        readingEventContentView.getElement(),
        new OpenEventButtonView().getElement(),
        AddedComponentPosition.BEFORE_END
    );

    // Подписка на кнопку открытия формы
    const elem = readingEventContentView.getElement()
      .querySelector(`.event__rollup-btn`);
    elem.addEventListener(`click`, () => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Подписка на отправку формы
    eventView.getElement()
        .addEventListener(`submit`, (evt1) => {
          evt1.preventDefault();
          replaceFormToEvent();
          document.removeEventListener(`keydown`, onEscKeyDown);
        });
  }

  // Формирование дерева событий с возвратом ее структуры
  fillTree() {
    const mapDates = this.getMapDates();

    let index = 0;
    for (const mapDateKey of mapDates.keys()) {
      // Какая-то дата путешествия
      const date = new Date(mapDateKey);

      // Отрисовка очередной даты
      const tripDaysItemView = new TripDaysItemView(date, index++);
      render(
          this.getElement(),
          tripDaysItemView.getElement(),
          AddedComponentPosition.BEFORE_END
      );

      const eventsListView = new EventsListView();
      render(
          tripDaysItemView.getElement(),
          eventsListView.getElement(),
          AddedComponentPosition.BEFORE_END
      );

      // события даты сортируем по дате начала
      const tmpEvents = mapDates.get(mapDateKey)
        .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                        b.timeInterval.leftLimitDate.getTime());
      // Цикл по всем событиям данной даты
      for (let j = 0; j < tmpEvents.length; ++j) {
        // Контейнер события
        const tripEventsItemView = new TripEventsItemView(tmpEvents[j]);
        render(
            eventsListView.getElement(),
            tripEventsItemView.getElement(),
            AddedComponentPosition.BEFORE_END
        );

        this.renderEvent(tmpEvents[j], tripEventsItemView);
      }
    }

    return mapDates;
  }
}
