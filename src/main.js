import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import FilterHeaderView from "./view/filter-header.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import {createEventTemplate} from "./view/full-event-creator.js";
import {AddedComponentPosition, renderElement} from "./common.js";
import {createTripInformationTemplate} from "./view/trip-information.js";
import {generateEvent} from "./mock/event.js";
import {createEventsPlanTemplate} from "./view/events-plan.js";

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

// Отрисовка меню и фильтров
const mainTripComponents = [
  new SiteMenuHeaderView(),
  new SiteMenuView(),
  new FilterHeaderView(),
  new FilterView()
];
const tripMainTripControlElement = tripMainElement
  .querySelector(`.trip-main__trip-controls`);
for (let i = 0; i < mainTripComponents.length; ++i) {
  renderElement(
      tripMainTripControlElement,
      mainTripComponents[i].getElement(),
      AddedComponentPosition.BEFORE_END
  );
}

// Сортировка
const sortEditContentElement = pageBodyElement.querySelector(`.trip-events`);
renderElement(
    sortEditContentElement,
    new SortingView().getElement(),
    AddedComponentPosition.BEFORE_END
);

// Форма добавления и редактирования события
createEventTemplate(null, sortEditContentElement);

// Формирование дерева плана путешествия
const planDateEventsMap = createEventsPlanTemplate(events);

createTripInformationTemplate(planDateEventsMap);
