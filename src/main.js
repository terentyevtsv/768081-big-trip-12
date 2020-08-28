import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import {AddedComponentPosition, render, remove} from "./utils/render.js";
import {generateEvent, typeOffers} from "./mock/event.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import TripInformationPresenter from "./presenter/trip-information.js";
import StatisticsView from "./view/statistics.js";
import {MenuItem, SortType} from "./const.js";
import SiteMenuModel from "./model/site-menu.js";

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
const siteMenuModel = new SiteMenuModel();
const siteMenuView = new SiteMenuView(siteMenuModel);
const mainTripComponents = [
  new SiteMenuHeaderView(),
  siteMenuView
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

const tripPresenter = new TripPresenter(
    tripEventsElement,
    pointsModel,
    offersModel,
    filterModel,
    siteMenuModel
);
tripPresenter.init();

const getPlanDateEventMap = () => tripPresenter.planDateEventsMap;
const tripInformationPresenter = new TripInformationPresenter(tripMainElement,
    filterModel, pointsModel, getPlanDateEventMap);
tripInformationPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
  filterPresenter.init();
});

let statisticsView = null;

const mainPageBodyContainerElement = document
  .querySelector(`.page-body__page-main .page-body__container`);
const handleSiteMenuClick = (menuItem) => {
  tripPresenter.currentSortType = SortType.EVENT;
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsView);

      // Показать таблицу
      tripPresenter.reload();
      tripInformationPresenter.load();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripInformationPresenter.unload();

      // Показать статистику
      statisticsView = new StatisticsView();
      render(mainPageBodyContainerElement, statisticsView, AddedComponentPosition.BEFORE_END);
      break;
  }
};
siteMenuView.setMenuClickHandler(handleSiteMenuClick);

