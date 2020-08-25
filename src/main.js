import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import {AddedComponentPosition, render} from "./utils/render.js";
import TripInformationContainerView from "./view/trip-information.js";
import {generateEvent, typeOffers} from "./mock/event.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";

const EVENTS_COUNT = 20;

// Инициализация модели предложений
const offersModel = new OffersModel();
offersModel.setOffers(typeOffers);

const events = new Array(EVENTS_COUNT).fill()
  .map(() => generateEvent(offersModel));

// Инициализация модели точек маршрута
const pointsModel = new PointsModel();
pointsModel.setPoints(events);

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

// Отрисовка меню и фильтров
const mainTripComponents = [
  new SiteMenuHeaderView(),
  new SiteMenuView()
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

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripMainTripControlElement, filterModel);
filterPresenter.init();

// Формирование дерева плана путешествия
const tripEventsElement = pageBodyElement
    .querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, offersModel);
tripPresenter.init();

const tripInformationContainer =
    new TripInformationContainerView(tripPresenter.planDateEventsMap);
tripInformationContainer.fillPrice();

render(
    tripMainElement,
    tripInformationContainer,
    AddedComponentPosition.AFTER_BEGIN
);
