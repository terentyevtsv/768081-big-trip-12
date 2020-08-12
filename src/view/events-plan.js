import TripEventsItemView from "./trip-events-item.js";
import {AddedComponentPosition, render} from "../common.js";
import TripDaysItemView from "./trip-days-item.js";
import OfferItemView from "./offer-item.js";
import EventsPlanContainerView from "./events-plan-container.js";
import EventsListView from "./events-list.js";
import SelectedOffersContainerView from "./selected-offers-container.js";
import OpenEventButtonView from "./open-event-button.js";
import ReadingEventContentView from "./reading-event-content.js";
import {createEventTemplate} from "./full-event-creator.js";

const MAX_OFFERS_COUNT = 3;

const renderEvent = (evt, tripEventsItemView) => {
  // Содержимое события (для чтения)
  const readingEventContentView = new ReadingEventContentView(evt);
  const editingEventContentView = createEventTemplate(evt);

  const replaceEventToForm = () => {
    tripEventsItemView.getElement().replaceChild(
        editingEventContentView.getElement(),
        readingEventContentView.getElement()
    );

    tripEventsItemView.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt1) => {
        evt1.preventDefault();
        replaceFormToEvent();
      });
  };

  const replaceFormToEvent = () => {
    tripEventsItemView.getElement().replaceChild(
        readingEventContentView.getElement(),
        editingEventContentView.getElement()
    );
  };

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

  const elem = tripEventsItemView.getElement()
    .querySelector(`.event__rollup-btn`);
  elem.addEventListener(`click`, () => replaceEventToForm());
};

export const createEventsPlanTemplate = (events) => {
  const datesSet = new Set();

  events.forEach((evt) => {
    const date = new Date(evt.timeInterval.leftLimitDate);
    date.setHours(0, 0, 0, 0);

    datesSet.add(date.getTime());
  });

  const dates = Array.from(datesSet)
    .sort((a, b) => a - b);
  const mapDates = new Map();
  dates.forEach((date) => mapDates.set(date, []));

  events.forEach((evt) => {
    const date = new Date(evt.timeInterval.leftLimitDate);
    date.setHours(0, 0, 0, 0);

    mapDates.get(date.getTime()).push(evt);
  });

  const pageBodyElement = document.querySelector(`.page-body`);
  const tripEventsElement = pageBodyElement
    .querySelector(`.trip-events`);

  // Отрисовка контейнера дат
  const eventsPlanContainerView = new EventsPlanContainerView();
  render(
      tripEventsElement,
      eventsPlanContainerView.getElement(),
      AddedComponentPosition.BEFORE_END
  );

  let index = 0;
  for (const mapDateKey of mapDates.keys()) {
    // Какая-то дата путешествия
    const date = new Date(mapDateKey);

    // Отрисовка очередной даты
    const tripDaysItemView = new TripDaysItemView(date, index++);
    render(
        eventsPlanContainerView.getElement(),
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

      renderEvent(tmpEvents[j], tripEventsItemView);
    }
  }

  return mapDates;
};
