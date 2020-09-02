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

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

const tripMainTripControlElement = tripMainElement
  .querySelector(`.trip-main__trip-controls`);

const tripEventsElement = pageBodyElement
  .querySelector(`.trip-events`);

const mainPageBodyContainerElement = document
  .querySelector(`.page-body__page-main .page-body__container`);

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

// Инициализация модели фильтра
const filterModel = new FilterModel();

// Инициализация модели меню
const siteMenuModel = new SiteMenuModel();

const tripPresenter = new TripPresenter(
    tripEventsElement,
    pointsModel,
    offersModel,
    filterModel,
    siteMenuModel,
    citiesModel
);
tripPresenter.renderEventsPlan(false);

const getPlanDateEventMap = () => tripPresenter.planDateEventsMap;
const tripInformationPresenter = new TripInformationPresenter(tripMainElement,
    filterModel, pointsModel, getPlanDateEventMap);

const errorMessagesObject = {
  offersTaskMessage: `типы точек маршрута`,
  citiesTaskMessage: `города`
};

let errorValuesCount = Object.values(errorMessagesObject).length;

const siteMenuView = new SiteMenuView(siteMenuModel);

api.getEventTypesOffers()
  .then((eventTypesOffers) => {
    delete errorMessagesObject.offersTaskMessage;

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
    delete errorMessagesObject.citiesTaskMessage;

    citiesMap.clear();
    destinations.forEach((destination) => {
      const currentDestination = CitiesModel.adaptDestinationToClient(destination);
      citiesMap.set(destination.name, currentDestination);
    });
    citiesModel.setCities(citiesMap);
  })
  .catch(() => {
    // отображение ошибки загрузки доп. данных
    tripPresenter.renderError(errorMessagesObject);
    filterModel.removeObserver(tripInformationPresenter.init);
    siteMenuView.removeMenuClickHandler();
  })
  .then(() => {
    errorValuesCount = Object.values(errorMessagesObject).length;
    if (errorValuesCount > 0) {
      return [];
    }
    return api.getPoints();
  })
  .then((points) => {
    if (errorValuesCount > 0) {
      tripInformationPresenter.init();
      return;
    }
    const tmpPoints = [];
    points.forEach((point) => {
      const eventType = eventTypesMap.get(point.type);
      const maskOffers = offersModel.getOffers(eventType);

      const tmpPoint = PointsModel.adaptToClient(point, eventType, maskOffers);
      tmpPoints.push(tmpPoint);
    });

    pointsModel.setPoints(tmpPoints);

    // Формирование дерева плана путешествия
    tripPresenter.init(true);
    tripInformationPresenter.init();
  })
  .catch(() => {
    if (errorValuesCount > 0) {
      return;
    }

    pointsModel.setPoints([]);

    // Формирование дерева плана путешествия
    tripPresenter.init(true);
    tripInformationPresenter.init();
  });

// Отрисовка меню и фильтров
const mainTripComponents = [
  new SiteMenuHeaderView(),
  siteMenuView
];

for (let i = 0; i < mainTripComponents.length; ++i) {
  render(
      tripMainTripControlElement,
      mainTripComponents[i],
      AddedComponentPosition.BEFORE_END
  );
}

const filterPresenter = new FilterPresenter(tripMainTripControlElement, filterModel);
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (errorValuesCount > 0) {
    return;
  }
  tripPresenter.createEvent();
  filterPresenter.init();
});

let statisticsView = null;

const handleSiteMenuClick = (menuItem) => {
  tripPresenter.currentSortType = SortType.EVENT;
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsView);

      // Показать таблицу
      if (errorValuesCount === 0) {
        tripPresenter.reload();
      }

      break;
    case MenuItem.STATS:
      tripPresenter.destroy();

      // Показать статистику
      statisticsView = new StatisticsView(pointsModel.getPoints());
      render(mainPageBodyContainerElement, statisticsView, AddedComponentPosition.BEFORE_END);
      break;
  }
};
siteMenuView.setMenuClickHandler(handleSiteMenuClick);

