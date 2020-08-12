import TripEventsItemView from "./trip-events-item.js";
import {AddedComponentPosition, render} from "../common.js";
import {createEventTemplate} from "./full-event-creator.js";
import TripDaysItemView from "./trip-days-item.js";
import OfferItemView from "./offer-item.js";
import EventsPlanContainerView from "./events-plan-container.js";

const MAX_OFFERS_COUNT = 3;
const FIRST_DATE_INDEX = 0;
const FIRST_EVENT_INDEX = 0;

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
      new EventsPlanContainerView().getElement(),
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
        new TripDaysItemView(date, index++).getElement(),
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

    // Цикл по всем событиям данной даты
    for (let j = 0; j < tmpEvents.length; ++j) {
      const isFirstEditableEvent = i === FIRST_DATE_INDEX && j === FIRST_EVENT_INDEX;
      render(
          tripDayEventsContainerElement,
          new TripEventsItemView(tmpEvents[j], isFirstEditableEvent).getElement(),
          AddedComponentPosition.BEFORE_END
      );

      if (isFirstEditableEvent) {
        const editableEventContainerElement = tripDayEventsContainerElement
          .querySelector(`.trip-events__item`);
        createEventTemplate(tmpEvents[j], editableEventContainerElement);
      }
    }

    const currentDateEventElements = tripDayEventsContainerElement
      .querySelectorAll(`.trip-events__item`);
    for (let j = 0; j < currentDateEventElements.length; ++j) {
      if (i === FIRST_DATE_INDEX && FIRST_EVENT_INDEX === 0) {
        continue;
      }
      const selectedOffersElement = currentDateEventElements[j]
        .querySelector(`.event__selected-offers`);
      let cnt = 0; // счетчик предложений для короткой записи события
      for (let k = 0; k < tmpEvents[j].offers.length; ++k) {
        if (tmpEvents[j].offers[k].isAccepted) {
          ++cnt;
          if (cnt > MAX_OFFERS_COUNT) {
            break;
          }

          render(
              selectedOffersElement,
              new OfferItemView(tmpEvents[j].offers[k]).getElement(),
              AddedComponentPosition.BEFORE_END
          );
        }
      }
    }
  }

  return mapDates;
};
