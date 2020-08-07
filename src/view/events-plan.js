import {createTripsTreeTemplate} from "./trip-days-item.js";
import {render, AddedComponentPosition} from "../common.js";

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

  const mapDateKeys = mapDates.keys();
  let index = 0;
  for (const mapDateKey of mapDateKeys) {
    // Какая-то дата путешествия
    const date = new Date(mapDateKey);
    const tmpEvents = mapDates.get(mapDateKey)
      .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                      b.timeInterval.leftLimitDate.getTime());

    createTripsTreeTemplate(date, tmpEvents, index++);
  }
};
