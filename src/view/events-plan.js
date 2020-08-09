import {createTripEventsItemTemplate} from "./trip-events-item.js";
import {render, AddedComponentPosition, dateToString, monthDayToString} from "../common.js";
import {createEventTemplate} from "./full-event-creator.js";

const MAX_OFFERS_COUNT = 3;
const FIRST_DATE_INDEX = 0;
const FIRST_EVENT_INDEX = 0;

const createTripDaysItemTemplate = (date, index) =>
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${dateToString(date)}">${monthDayToString(date)}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>`;

const createOfferItemTemplate = (offer) =>
  `<li class="event__offer">
    <span class="event__offer-title">${offer.name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`;

const createEventsPlanContainerTemplate = () =>
  `<ul class="trip-days"></ul>`;

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
  render(
      tripEventsElement,
      createEventsPlanContainerTemplate(),
      AddedComponentPosition.BEFORE_END
  );

  let index = 0;
  const tripDaysElement = document.querySelector(`.trip-days`);
  for (const mapDateKey of mapDates.keys()) {
    // Какая-то дата путешествия
    const date = new Date(mapDateKey);

    // Отрисовка очередной даты
    render(
        tripDaysElement,
        createTripDaysItemTemplate(date, index++),
        AddedComponentPosition.BEFORE_END
    );
  }

  const tripDayElements = tripDaysElement.querySelectorAll(`.trip-days__item`);
  const mapDateKeys = Array.from(mapDates.keys());

  for (let i = 0; i < tripDayElements.length; ++i) {
    // контейнер событий для контейнера текущей даты
    const tripDayEventsContainerElement = tripDayElements[i].querySelector(`.trip-events__list`);

    // события даты сортируем по дате начала
    const tmpEvents = mapDates.get(mapDateKeys[i])
      .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                      b.timeInterval.leftLimitDate.getTime());
    for (let j = 0; j < tmpEvents.length; ++j) {
      const isFirstEditableEvent = i === FIRST_DATE_INDEX && j === FIRST_EVENT_INDEX;
      render(
          tripDayEventsContainerElement,
          createTripEventsItemTemplate(
              tmpEvents[j],
              isFirstEditableEvent
          ),
          AddedComponentPosition.BEFORE_END
      );

      if (isFirstEditableEvent) {
        const editableEventContainerElement = tripDayEventsContainerElement.querySelector(`.trip-events__item`);
        createEventTemplate(tmpEvents[j], editableEventContainerElement);
      }
    }

    // Цикл по всем событиям данной даты
    const currentDateEventElements = tripDayEventsContainerElement.querySelectorAll(`.trip-events__item`);
    for (let j = 0; j < currentDateEventElements.length; ++j) {
      if (i === FIRST_DATE_INDEX && FIRST_EVENT_INDEX === 0) {
        continue;
      }
      const selectedOffersElement = currentDateEventElements[j].querySelector(`.event__selected-offers`);
      let cnt = 0; // счетчик предложений для короткой записи события
      for (let k = 0; k < tmpEvents[j].offers.length; ++k) {
        if (tmpEvents[j].offers[k].isAccepted) {
          ++cnt;
          if (cnt > MAX_OFFERS_COUNT) {
            break;
          }

          render(
              selectedOffersElement,
              createOfferItemTemplate(tmpEvents[j].offers[k]),
              AddedComponentPosition.BEFORE_END
          );
        }
      }
    }
  }
};
