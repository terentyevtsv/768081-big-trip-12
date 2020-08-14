import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import FilterHeaderView from "./view/filter-header.js";
import FilterView from "./view/filter.js";
import {AddedComponentPosition, render} from "./utils/render.js";
import TripInformationContainerView from "./view/trip-information.js";
import {generateEvent} from "./mock/event.js";
import TripPresenter from "./presenter/trip.js";

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
      mainTripComponents[i],
      AddedComponentPosition.BEFORE_END
  );
}

// Формирование дерева плана путешествия
const tripEventsElement = pageBodyElement
    .querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(events);

const tripInformationContainer =
    new TripInformationContainerView(tripPresenter.planDateEventsMap);
tripInformationContainer.fillPrice();

render(
    tripMainElement,
    tripInformationContainer,
    AddedComponentPosition.AFTER_BEGIN
);
