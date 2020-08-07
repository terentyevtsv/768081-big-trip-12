import {render, AddedComponentPosition, dateToString, monthDayToString} from "../common.js";
import {createTripEventsItemTemplate} from "./trip-events-item.js";

const createTripDaysItemTemplate = (date, index) =>
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${dateToString(date)}">${monthDayToString(date)}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>`;

export const createTripsTreeTemplate = (date, events, index) => {
  const tripDaysElement = document.querySelector(`.trip-days`);

  // Отрисовка очередной даты
  render(
      tripDaysElement,
      createTripDaysItemTemplate(date, index),
      AddedComponentPosition.BEFORE_END
  );

  const tripDayElements = tripDaysElement.querySelectorAll(`.trip-days__item`);
  const tripDayElement = tripDayElements[tripDayElements.length - 1];
  const tripDayEventsContainerElement = tripDayElement.querySelector(`.trip-events__list`);

  for (let i = 0; i < events.length; ++i) {
    render(
        tripDayEventsContainerElement,
        createTripEventsItemTemplate(events[i]),
        AddedComponentPosition.BEFORE_END
    );
  }
};
