import {render, AddedComponentPosition, remove} from "../utils/render.js";
import NoEventView from "../view/no-event.js";
import SortingView from "../view/sorting.js";
import EventsPlanContainerView from "../view/events-plan-container.js";
import TripDaysItemView from "../view/trip-days-item.js";
import EventsListView from "../view/events-list.js";
import TripEventsItemView from "../view/trip-events-item.js";
import {SortType} from "../const.js";
import TripEventPresenter from "./trip-event.js";
import {filter} from "../utils/filter.js";

const getDifference = function (timeInterval) {
  return (
    timeInterval.rightLimitDate.getTime() -
    timeInterval.leftLimitDate.getTime()
  );
};

export default class Trip {
  constructor(tripEventsContainer, pointsModel, offersModel, filterModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.EVENT;
    this._noEventView = new NoEventView();
    this._sortingView = null;
    this._eventsPlanContainerView = new EventsPlanContainerView();

    this._eventPresenter = {};
    this._dateContainers = [];

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilterChanged = this._handleFilterChanged.bind(this);

    this._filterModel.addObserver(this._handleFilterChanged);
  }

  _handleFilterChanged() {
    this._currentSortType = SortType.EVENT;
    this.init();
  }

  get planDateEventsMap() {
    return this._planDateEventsMap;
  }

  init() {
    this._planDateEventsMap = this._getMapDates();
    this._renderEventsPlan();
  }

  _getPoints(filterType) {
    return filter[filterType](this._pointsModel.getPoints());
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // Обновление мока и отрисовка согласно обновлению точки марщрута
  _handleEventChange(updatedEvent) {
    this._pointsModel.updatePoint(updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
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
        this._offersModel,
        this._handleEventChange,
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
    // Метод для рендеринга заглушки
    render(
        this._tripEventsContainer,
        this._noEventView,
        AddedComponentPosition.BEFORE_END
    );
  }

  _renderEventsPlan() {
    const points = this._getPoints(this._filterModel.getFilter());
    if (points.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();

    render(
        this._tripEventsContainer,
        this._eventsPlanContainerView,
        AddedComponentPosition.BEFORE_END
    );
    this._renderEvents(this._planDateEventsMap);
  }
}
