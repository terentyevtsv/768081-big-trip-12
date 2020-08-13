import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import FilterHeaderView from "./view/filter-header.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import {AddedComponentPosition, render} from "./common.js";
import TripInformationContainerView from "./view/trip-information.js";
import {generateEvent} from "./mock/event.js";
import EventsPlanContainerView from "./view/events-plan-container.js";
import NoEventView from "./view/no-event.js";

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
  render(
      tripMainTripControlElement,
      mainTripComponents[i].getElement(),
      AddedComponentPosition.BEFORE_END
  );
}

// Формирование дерева плана путешествия
const tripEventsElement = pageBodyElement
    .querySelector(`.trip-events`);

const eventsPlanContainerView = new EventsPlanContainerView(events);
const planDateEventsMap = eventsPlanContainerView.fillTree();
if (events.length > 0) {
  // Сортировка
  const sortEditContentElement = pageBodyElement
    .querySelector(`.trip-events`);
  render(
      sortEditContentElement,
      new SortingView().getElement(),
      AddedComponentPosition.BEFORE_END
  );

  // Отрисовка контейнера дат
  render(
      tripEventsElement,
      eventsPlanContainerView.getElement(),
      AddedComponentPosition.BEFORE_END
  );
} else {
  render(
      tripEventsElement,
      new NoEventView().getElement(),
      AddedComponentPosition.BEFORE_END
  );
}

const tripInformationContainer =
    new TripInformationContainerView(planDateEventsMap);
tripInformationContainer.fillPrice();

render(
    tripMainElement,
    tripInformationContainer.getElement(),
    AddedComponentPosition.AFTER_BEGIN
);
