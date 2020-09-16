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
import Api from "./api/api.js";
import CitiesModel from "./model/cities.js";
import NewPointButtonView from "./view/new-point-button.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import PointsFiltration from "./utils/filter.js";

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VERSION = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;

const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const AUTHORIZATION = `Basic mokrajbalka1`;

const pageBodyElement = document.querySelector(`.page-body`);

// Шапка
const tripMainElement = pageBodyElement.querySelector(`.trip-main`);

const tripMainTripControlElement = tripMainElement
  .querySelector(`.trip-main__trip-controls`);

const tripPointsElement = pageBodyElement
  .querySelector(`.trip-events`);

const mainPageBodyContainerElement = document
  .querySelector(`.page-body__page-main .page-body__container`);

const typeOffers = new Map(); // Все возможные значения предложений для каждого типа события
const eventTypesDictionary = new Map(); // Тип события по его названию

// Инициализация модели предложений
const offersModel = new OffersModel();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

// Инициализация модели городов
const citiesModel = new CitiesModel();

// Инициализация модели точек маршрута
const pointsModel = new PointsModel();
pointsModel.setСitiesStructure(new Map()); // Города с общим описанием, фото и описанием фото

// Инициализация модели фильтра
const filterModel = new FilterModel();

// Инициализация модели меню
const siteMenuModel = new SiteMenuModel();

const newPointButtonView = new NewPointButtonView(true);

const filterPresenter = new FilterPresenter(tripMainTripControlElement, filterModel);

const tripPresenter = new TripPresenter(
    filterPresenter,
    tripPointsElement,
    pointsModel,
    offersModel,
    filterModel,
    siteMenuModel,
    citiesModel,
    newPointButtonView,
    apiWithProvider
);

tripPresenter.renderPointsPlan(false);

const getDatePointsPlan = () => tripPresenter.datePointsPlan;
const tripInformationPresenter = new TripInformationPresenter(tripMainElement,
    filterModel, pointsModel, getDatePointsPlan);

const errorMessage = {
  offersTaskMessage: `типы точек маршрута`,
  citiesTaskMessage: `города`
};

let errorValuesCount = Object.values(errorMessage).length;

const siteMenuView = new SiteMenuView(siteMenuModel);

const renderPointsAfterLoading = (points) => {
  const tempPoints = [];
  points.forEach((point) => {
    const eventType = eventTypesDictionary.get(point.type);
    const maskOffers = offersModel.getOffers(eventType);

    const tempPoint = PointsModel.adaptToClient(point, eventType, maskOffers);
    tempPoints.push(tempPoint);
  });

  pointsModel.setPoints(tempPoints);

  const pointsFiltration = new PointsFiltration(tempPoints);
  pointsFiltration.setFilterDisabledFlags(filterModel);

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

  filterPresenter.initialize();

  // Формирование дерева плана путешествия
  tripPresenter.initialize(true);
  tripInformationPresenter.initialize();
};

apiWithProvider.getEventTypesOffers()
  .then((eventTypesOffers) => {
    delete errorMessage.offersTaskMessage;

    typeOffers.clear();
    eventTypesDictionary.clear();

    eventTypesOffers.forEach((eventTypesOffer) => {
      const eventType = OffersModel.adaptEventTypeToClient(eventTypesOffer);

      if (!typeOffers.has(eventType)) {
        typeOffers.set(eventType, []);
        eventTypesDictionary.set(eventTypesOffer.type, eventType);
      }

      eventTypesOffer.offers.forEach((offer) => {
        const currentOffer = OffersModel.adaptOfferToClient(offer);
        typeOffers.get(eventType).push(currentOffer);
      });

    });

    offersModel.setOffers(typeOffers);
  })
  .then(() => {
    return apiWithProvider.getDestinations();
  })
  .then((destinations) => {
    delete errorMessage.citiesTaskMessage;

    pointsModel.getCitiesStructure().clear();
    destinations.forEach((destination) => {
      const currentDestination = CitiesModel.adaptDestinationToClient(destination);
      pointsModel.getCitiesStructure().set(destination.name, currentDestination);
    });
    citiesModel.setCities(pointsModel.getCitiesStructure());
  })
  .catch(() => {
    // отображение ошибки загрузки доп. данных
    tripPresenter.renderError(errorMessage);
    filterModel.removeObserver(tripInformationPresenter.initialize);
    siteMenuView.removeMenuClickHandler();
  })
  .then(() => {
    errorValuesCount = Object.values(errorMessage).length;
    if (errorValuesCount > 0) {
      return [];
    }

    return apiWithProvider.getPoints();
  })
  .then((points) => {
    if (errorValuesCount > 0) {
      return;
    }

    render(tripMainElement, newPointButtonView, AddedComponentPosition.BEFORE_END);
    renderPointsAfterLoading(points);
  })
  .catch(() => {
    if (errorValuesCount > 0) {
      return;
    }

    render(tripMainElement, newPointButtonView, AddedComponentPosition.BEFORE_END);

    pointsModel.setPoints([]);
    renderPointsAfterLoading(pointsModel.getPoints());
  });

newPointButtonView.setButtonClickHandler((evt) => {
  evt.preventDefault();

  if (siteMenuModel.getMenuItem() !== MenuItem.TABLE) {
    siteMenuView.updateSiteMenu(MenuItem.TABLE);
    handleSiteMenuClick(MenuItem.TABLE);
  }

  tripPresenter.createPoint();
  filterPresenter.initialize();
});

let statisticsView = null;

const handleSiteMenuClick = (menuItem) => {
  tripPresenter.currentSortType = SortType.EVENT;
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsView);

      // Показать таблицу
      tripPresenter.reload();

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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.shouldSynchronize) {
    apiWithProvider.synchronize();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
