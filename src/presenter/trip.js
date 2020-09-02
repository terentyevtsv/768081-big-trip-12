import {render, AddedComponentPosition, remove, replace} from "../utils/render.js";
import NoEventView from "../view/no-event.js";
import SortingView from "../view/sorting.js";
import EventsPlanContainerView from "../view/events-plan-container.js";
import TripDaysItemView from "../view/trip-days-item.js";
import EventsListView from "../view/events-list.js";
import TripEventsItemView from "../view/trip-events-item.js";
import {SortType, FilterType, UserAction, MenuItem} from "../const.js";
import TripEventPresenter from "./trip-event.js";
import {filter} from "../utils/filter.js";
import EventNewPresenter from "./event-new.js";
import LoadingView from "../view/loading.js";

const getDifference = function (timeInterval) {
  return (
    timeInterval.rightLimitDate.getTime() -
    timeInterval.leftLimitDate.getTime()
  );
};

export default class Trip {
  constructor(
      tripEventsContainer,
      pointsModel,
      offersModel,
      filterModel,
      siteMenuModel,
      citiesModel,
      newEventButtonView
  ) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._siteMenuModel = siteMenuModel;
    this._citiesModel = citiesModel;
    this._newEventButtonView = newEventButtonView;

    this._isLoading = true;
    this._loadingView = new LoadingView();
    this._errorLoadingView = null;

    this._currentSortType = SortType.EVENT;
    this._noEventView = new NoEventView();
    this._sortingView = null;
    this._eventsPlanContainerView = new EventsPlanContainerView();

    this._eventPresenter = {};
    this._dateContainers = [];

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilterChanged = this._handleFilterChanged.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
    this._renderSort = this._renderSort.bind(this);

    this._filterModel.addObserver(this._handleFilterChanged);
    this._pointsModel.addObserver(this._handleModelChange);
    this._siteMenuModel.addObserver(this._renderSort);
    this._eventNewPresenter = null;
  }

  get planDateEventsMap() {
    return this._planDateEventsMap;
  }

  set currentSortType(sortType) {
    this._currentSortType = sortType;
  }

  createEvent() {
    this._filterModel.setFilter(FilterType.EVERYTHING);
    this._currentSortType = SortType.EVENT;
    this._planDateEventsMap = this._getMapDates();
    this.renderEventsPlan(true);
  }

  _handleModelChange() {
    this._planDateEventsMap = this._getMapDates();
    this.renderEventsPlan(false);
  }

  _handleFilterChanged() {
    remove(this._noEventView);
    this._currentSortType = SortType.EVENT;
    this.init(false);
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingView, AddedComponentPosition.BEFORE_END);
  }

  init(isFirstLoading) {
    if (isFirstLoading) {
      this._isLoading = false;
      remove(this._loadingView);

      this._eventNewPresenter = new EventNewPresenter(
          this._tripEventsContainer,
          this._offersModel,
          this._citiesModel,
          this._newEventButtonView,
          this._handleViewAction,
          this._handleModeChange
      );
    }

    this._planDateEventsMap = this._getMapDates();
    if (this._siteMenuModel.getMenuItem() === MenuItem.TABLE) {
      this.renderEventsPlan(false);
    }
  }

  renderError(messageObject) {
    const fullMessage = `Не загружены ${Object.values(messageObject).join(` и `)}`;
    this._errorLoadingView = new LoadingView(fullMessage);
    replace(this._errorLoadingView, this._loadingView);

    this._filterModel.removeObserver(this._handleFilterChanged);
    this._siteMenuModel.removeObserver(this._renderSort);
  }

  reload() {
    this._siteMenuModel.addObserver(this._renderSort);
    this.init(false);
  }

  destroy() {
    this._isLoading = false;
    if (this._eventNewPresenter !== null) {
      this._eventNewPresenter.destroy();
    }

    if (this._sortingView !== null) {
      remove(this._sortingView);
    }

    remove(this._eventsPlanContainerView);
    if (this._errorLoadingView !== null) {
      remove(this._errorLoadingView);
      this._errorLoadingView = null;
    }

    remove(this._noEventView);
  }

  _getPoints(filterType) {
    return filter[filterType](this._pointsModel.getPoints());
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // Обновление мока и отрисовка согласно обновлению точки марщрута
  _handleViewAction(actionType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._pointsModel.updatePoint(update);
        break;
      case UserAction.ADD_EVENT:
        this._pointsModel.addPoint(update);
        break;
      case UserAction.DELETE_EVENT:
        this._pointsModel.deletePoint(update);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    const mapDates = this._getMapDates();
    this._renderEvents(mapDates);
  }

  // Формирование структуры событий по датам
  _getMapDates() {
    const mapDates = new Map();
    const points = this._getPoints(this._filterModel.getFilter());

    if (this._currentSortType === SortType.EVENT) {
      // Обычный порядок
      const datesSet = new Set();

      // Формируем список дат, по которым будут группироваться события
      points.forEach((evt) => {
        const date = new Date(evt.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        datesSet.add(date.getTime());
      });

      // Сортируем даты в порядке возрастания
      const dates = Array.from(datesSet)
        .sort((a, b) => a - b);

      // Раскидываем события по датам
      dates.forEach((date) => mapDates.set(date, []));

      points.forEach((evt) => {
        const date = new Date(evt.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        mapDates.get(date.getTime()).push(evt);
      });

      Array.from(mapDates.keys()).forEach((mapDateKey) => mapDates.get(mapDateKey)
        .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                        b.timeInterval.leftLimitDate.getTime())
      );
      return mapDates;
    }

    const tmpDate = new Date();
    const events = points.slice();
    if (this._currentSortType === SortType.TIME) {
      // Порядок с сортировкой по времени события
      events.sort((evt1, evt2) => getDifference(evt2.timeInterval) -
                                  getDifference(evt1.timeInterval));
      mapDates.set(tmpDate, events);

      return mapDates;
    }

    // Порядок с сортировкой по цене
    events.sort((evt1, evt2) => evt2.price - evt1.price);
    mapDates.set(tmpDate, events);

    return mapDates;
  }

  _renderSort() {
    if (this._sortingView !== null) {
      remove(this._sortingView);
      this._sortingView = null;
    }

    this._sortingView = new SortingView(this._currentSortType);

    // Метод для рендеринга сортировки
    // Сортировка
    render(
        this._tripEventsContainer,
        this._sortingView,
        AddedComponentPosition.BEFORE_END
    );

    this._sortingView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(evt, eventsListView) {
    // Контейнер события
    const tripEventsItemView = new TripEventsItemView();
    render(
        eventsListView,
        tripEventsItemView,
        AddedComponentPosition.BEFORE_END
    );

    const tripEventPresenter = new TripEventPresenter(
        evt,
        tripEventsItemView,
        this._pointsModel,
        this._offersModel,
        this._citiesModel,
        this._handleViewAction,
        this._handleModeChange
    );
    tripEventPresenter.init(evt);
    this._eventPresenter[evt.id] = tripEventPresenter;
  }

  _renderEvents(mapDates) {
    Object.values(this._eventPresenter)
        .forEach((presenter) => presenter.destroy());
    this._dateContainers.forEach((d) => remove(d));

    this._eventPresenter = {};
    this._dateContainers = [];

    let index = 0;
    for (const mapDateKey of mapDates.keys()) {
      // Какая-то дата путешествия
      const date = new Date(mapDateKey);

      // Отрисовка очередной даты
      const tripDaysItemView = new TripDaysItemView(date, index, this._currentSortType);
      render(
          this._eventsPlanContainerView,
          tripDaysItemView,
          AddedComponentPosition.BEFORE_END
      );

      const eventsListView = new EventsListView();
      render(
          tripDaysItemView,
          eventsListView,
          AddedComponentPosition.BEFORE_END
      );

      this._dateContainers[index++] = tripDaysItemView;

      // события даты сортируем по дате начала
      const tmpEvents = mapDates.get(mapDateKey);
      // Цикл по всем событиям данной даты
      for (let j = 0; j < tmpEvents.length; ++j) {
        this._renderEvent(tmpEvents[j], eventsListView);
      }
    }
  }

  _renderNoEvents() {
    if (this._sortingView !== null) {
      remove(this._sortingView);
      this._sortingView = null;
    }

    remove(this._eventsPlanContainerView);

    // Метод для рендеринга заглушки
    render(
        this._tripEventsContainer,
        this._noEventView,
        AddedComponentPosition.BEFORE_END
    );
  }

  renderEventsPlan(renderNewEventFlag) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints(this._filterModel.getFilter());
    if (points.length === 0) {
      if (renderNewEventFlag) {
        remove(this._noEventView);
        this._eventNewPresenter.init();
        return;
      }
      this._renderNoEvents();
      return;
    }

    this._renderSort();

    if (renderNewEventFlag) {
      this._eventNewPresenter.init();
    }

    render(
        this._tripEventsContainer,
        this._eventsPlanContainerView,
        AddedComponentPosition.BEFORE_END
    );
    this._renderEvents(this._planDateEventsMap);
  }
}
