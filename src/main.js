import SiteMenuView from "./view/site-menu.js";
import SiteMenuHeaderView from "./view/site-menu-header.js";
import {AddedComponentPosition, render, remove} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import FilterPresenter from "./presenter/filter.js";
import FilterModel from "./model/filter.js";
import TripInformationPresenter from "./presenter/trip-information.js";
import StatisticsView from "./view/statistics.js";
import {MenuItem, SortType} from "./const.js";
import SiteMenuModel from "./model/site-menu.js";
import Api from "./api.js";
import CitiesModel from "./model/cities.js";

const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const AUTHORIZATION = `Basic mokrajbalka`;

const api = new Api(END_POINT, AUTHORIZATION);

const typeOffers = new Map(); // Все возможные значения предложений для каждого типа события
const eventTypesMap = new Map(); // Тип события по его названию
const citiesMap = new Map(); // Города с общим описанием, фото и описанием фото

// Инициализация модели предложений
const offersModel = new OffersModel();

// Инициализация модели городов
const citiesModel = new CitiesModel();

// Инициализация модели точек маршрута
const pointsModel = new PointsModel();

api.getEventTypesOffers()
  .then((eventTypesOffers) => {
    typeOffers.clear();
    eventTypesMap.clear();

    eventTypesOffers.forEach((eventTypesOffer) => {
      const eventType = OffersModel.adaptEventTypeToClient(eventTypesOffer);

      if (!typeOffers.has(eventType)) {
        typeOffers.set(eventType, []);
        eventTypesMap.set(eventTypesOffer.type, eventType);
      }

      eventTypesOffer.offers.forEach((offer) => {
        const currentOffer = OffersModel.adaptOfferToClient(offer);
        typeOffers.get(eventType).push(currentOffer);
      });

    });

    offersModel.setOffers(typeOffers);
  })
  .then(() => {
    return api.getDestinations();
  })
  .then((destinations) => {
    citiesMap.clear();
    destinations.forEach((destination) => {
      const currentDestination = CitiesModel.adaptDestinationToClient(destination);
      citiesMap.set(destination.name, currentDestination);
    });
    citiesModel.setCities(citiesMap);
  })
  .then(() => {
    return api.getPoints();
  })
  .then((points) => {
    const tmpPoints = [];
    points.forEach((point) => {
      const eventType = eventTypesMap.get(point.type);
      const maskOffers = offersModel.getOffers(eventType);

      const tmpPoint = PointsModel.adaptToClient(point, eventType, maskOffers);
      tmpPoints.push(tmpPoint);
    });

    pointsModel.setPoints(tmpPoints);
  });

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
    siteMenuModel,
    citiesModel
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
      statisticsView = new StatisticsView(pointsModel.getPoints());
      render(mainPageBodyContainerElement, statisticsView, AddedComponentPosition.BEFORE_END);
      break;
  }
};
siteMenuView.setMenuClickHandler(handleSiteMenuClick);

