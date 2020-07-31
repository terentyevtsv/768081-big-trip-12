import {render, AddedComponentPosition} from "../common.js";
import {createTripDaysItemTemplate} from "./trip-days-item.js";
import {createTripEventsItemTemplate} from "./trip-events-item.js";

const ROUTE_POINT_COUNT = 3;

export const createEventsPlanTemplate = () => {
  const pageBodyElement = document.querySelector(`.page-body`);
  const sortEditContentElement = pageBodyElement.querySelector(`.trip-events`);

  // Какая-то дата путешествия
  render(sortEditContentElement, createTripDaysItemTemplate(), AddedComponentPosition.BEFORE_END);
  const tripEventsListElement = sortEditContentElement.querySelector(`.trip-events__list`);
  for (let i = 0; i < ROUTE_POINT_COUNT; ++i) {
    render(tripEventsListElement, createTripEventsItemTemplate(), AddedComponentPosition.BEFORE_END);
  }
};
