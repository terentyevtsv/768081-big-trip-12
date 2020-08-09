import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sorting.js";
import {createEventTemplate} from "./view/full-event-creator.js";
import {render, AddedComponentPosition} from "./common.js";
import {createEventsPlanTemplate} from "./view/events-plan.js";
import {createTripInformationTemplate} from "./view/trip-information.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

createTripInformationTemplate();

// Отрисовка меню и фильтров
const mainTripComponents = [
  createSiteMenuTemplate,
  createSiteFilterTemplate
];
const tripMainControlElements = tripMainElement
  .querySelectorAll(`.trip-main__trip-controls .visually-hidden`);
for (let i = 0; i < tripMainControlElements.length; ++i) {
  render(tripMainControlElements[i], mainTripComponents[i](), AddedComponentPosition.AFTER_END);
}

// Сортировка
const sortEditContentElement = pageBodyElement.querySelector(`.trip-events`);
render(sortEditContentElement, createSortTemplate(), AddedComponentPosition.BEFORE_END);

// Форма добавления и редактирования события
createEventTemplate(null, sortEditContentElement);

// Какая-то дата путешествия
createEventsPlanTemplate(events);
