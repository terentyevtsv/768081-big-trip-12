import {createSiteMenuTemplate, createSiteMenuHeaderTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate, createSiteFilterHeaderTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sorting.js";
import {createEventTemplate} from "./view/full-event-creator.js";
import {renderTemplate, AddedComponentPosition} from "./common.js";
import {createEventsPlanTemplate} from "./view/events-plan.js";
import {createTripInformationTemplate} from "./view/trip-information.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

// Отрисовка меню и фильтров
const mainTripComponents = [
  createSiteMenuHeaderTemplate,
  createSiteMenuTemplate,
  createSiteFilterHeaderTemplate,
  createSiteFilterTemplate
];
const tripMainTripControlElement = tripMainElement
  .querySelector(`.trip-main__trip-controls`);
for (let i = 0; i < mainTripComponents.length; ++i) {
  renderTemplate(
      tripMainTripControlElement,
      mainTripComponents[i](),
      AddedComponentPosition.BEFORE_END
  );
}

// Сортировка
const sortEditContentElement = pageBodyElement.querySelector(`.trip-events`);
renderTemplate(sortEditContentElement, createSortTemplate(), AddedComponentPosition.BEFORE_END);

// Форма добавления и редактирования события
createEventTemplate(null, sortEditContentElement);

// Формирование дерева плана путешествия
const planDateEventsMap = createEventsPlanTemplate(events);

createTripInformationTemplate(planDateEventsMap);
