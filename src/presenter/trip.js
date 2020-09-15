import {render, AddedComponentPosition, remove, replace} from "../utils/render.js";
import NoPointsView from "../view/no-points.js";
import SortingView from "../view/sorting.js";
import PointsPlanContainerView from "../view/points-plan-container.js";
import TripDaysItemView from "../view/trip-days-item.js";
import PointsListView from "../view/points-list.js";
import TripPointsItemView from "../view/trip-points-item.js";
import {SortType, FilterType, UserAction, MenuItem} from "../const.js";
import TripPointPresenter from "./trip-point.js";
import PointsFiltration from "../utils/filter.js";
import NewPointPresenter from "./new-point.js";
import LoadingView from "../view/loading.js";

const getTimeIntervalsDifference = function (timeInterval) {
  return (
    timeInterval.rightLimitDate.getTime() -
    timeInterval.leftLimitDate.getTime()
  );
};

export default class Trip {
  constructor(
      filterPresenter,
      tripPointsContainer,
      pointsModel,
      offersModel,
      filterModel,
      siteMenuModel,
      citiesModel,
      newPointButtonView,
      api
  ) {
    this._filterPresenter = filterPresenter;
    this._tripPointsContainer = tripPointsContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._siteMenuModel = siteMenuModel;
    this._citiesModel = citiesModel;
    this._newPointButtonView = newPointButtonView;
    this._api = api;

    this._isLoading = true;
    this._loadingView = new LoadingView();
    this._errorLoadingView = null;

    this._currentSortType = SortType.EVENT;
    this._noPointsView = new NoPointsView();
    this._sortingView = null;
    this._pointsPlanContainerView = new PointsPlanContainerView();

    this._pointPresenter = {};
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
    this._newPointPresenter = null;
  }

  get planDatePointsMap() {
    return this._planDatePointsMap;
  }

  set currentSortType(sortType) {
    this._currentSortType = sortType;
  }

  createPoint() {
    this._filterModel.setFilter(FilterType.EVERYTHING);
    this._currentSortType = SortType.EVENT;
    this._planDatePointsMap = this._getMapDates();
    this.renderPointsPlan(true);
  }

  _handleModelChange() {
    this._planDatePointsMap = this._getMapDates();
    this.renderPointsPlan(false);
  }

  _handleFilterChanged() {
    remove(this._noPointsView);
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }

    this._currentSortType = SortType.EVENT;
    this.initialize(false);
  }

  _renderLoading() {
    render(this._tripPointsContainer, this._loadingView, AddedComponentPosition.BEFORE_END);
  }

  initialize(isFirstLoading) {
    if (isFirstLoading) {
      this._isLoading = false;
      remove(this._loadingView);

      this._newPointPresenter = new NewPointPresenter(
          this._filterPresenter,
          this._tripPointsContainer,
          this._offersModel,
          this._citiesModel,
          this._pointsModel,
          this._filterModel,
          this._newPointButtonView,
          this._handleViewAction,
          this._handleModeChange,
          this._api
      );
    }

    this._planDatePointsMap = this._getMapDates();
    if (this._siteMenuModel.getMenuItem() === MenuItem.TABLE) {
      this.renderPointsPlan(false);
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
    this.initialize(false);
  }

  destroy() {
    this._isLoading = false;
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }

    if (this._sortingView !== null) {
      remove(this._sortingView);
    }

    remove(this._pointsPlanContainerView);
    if (this._errorLoadingView !== null) {
      remove(this._errorLoadingView);
      this._errorLoadingView = null;
    }

    remove(this._noPointsView);
  }

  _getPoints(filterType) {
    const pointsFiltration = new PointsFiltration(this._pointsModel.getPoints());
    return pointsFiltration.getPoints(filterType);
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // Обновление точки маршрута
  _handleViewAction(actionType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(update);
        break;
      case UserAction.DELETE_POINT:
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
    this._renderPoints(mapDates);
  }

  // Формирование структуры событий по датам
  _getMapDates() {
    const mapDates = new Map();
    const points = this._getPoints(this._filterModel.getFilter());

    if (this._currentSortType === SortType.EVENT) {
      // Обычный порядок
      const datesSet = new Set();

      // Формируем список дат, по которым будут группироваться события
      points.forEach((point) => {
        const date = new Date(point.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        datesSet.add(date.getTime());
      });

      // Сортируем даты в порядке возрастания
      const dates = Array.from(datesSet)
        .sort((a, b) => a - b);

      // Раскидываем события по датам
      dates.forEach((date) => mapDates.set(date, []));

      points.forEach((point) => {
        const date = new Date(point.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        mapDates.get(date.getTime()).push(point);
      });

      Array.from(mapDates.keys()).forEach((mapDateKey) => mapDates.get(mapDateKey)
        .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                        b.timeInterval.leftLimitDate.getTime())
      );
      return mapDates;
    }

    const tempDate = new Date();
    const copyPoints = points.slice();
    if (this._currentSortType === SortType.TIME) {
      // Порядок с сортировкой по времени точки маршрута
      copyPoints.sort((point1, point2) => getTimeIntervalsDifference(point2.timeInterval) -
                                  getTimeIntervalsDifference(point1.timeInterval));
      mapDates.set(tempDate, copyPoints);

      return mapDates;
    }

    // Порядок с сортировкой по цене
    copyPoints.sort((point1, point2) => point2.price - point1.price);
    mapDates.set(tempDate, copyPoints);

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
        this._tripPointsContainer,
        this._sortingView,
        AddedComponentPosition.BEFORE_END
    );

    this._sortingView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point, pointsListView) {
    // Контейнер события
    const tripPointsItemView = new TripPointsItemView();
    render(
        pointsListView,
        tripPointsItemView,
        AddedComponentPosition.BEFORE_END
    );

    const tripPointPresenter = new TripPointPresenter(
        point,
        this._filterPresenter,
        tripPointsItemView,
        this._pointsModel,
        this._offersModel,
        this._citiesModel,
        this._filterModel,
        this._handleViewAction,
        this._handleModeChange,
        this._api
    );
    tripPointPresenter.initialize(point);
    this._pointPresenter[point.id] = tripPointPresenter;
  }

  _renderPoints(mapDates) {
    Object.values(this._pointPresenter)
        .forEach((presenter) => presenter.destroy());
    this._dateContainers.forEach((d) => remove(d));

    this._pointPresenter = {};
    this._dateContainers = [];

    let index = 0;
    for (const mapDateKey of mapDates.keys()) {
      // Какая-то дата путешествия
      const date = new Date(mapDateKey);

      // Отрисовка очередной даты
      const tripDaysItemView = new TripDaysItemView(date, index, this._currentSortType);
      render(
          this._pointsPlanContainerView,
          tripDaysItemView,
          AddedComponentPosition.BEFORE_END
      );

      const pointsListView = new PointsListView();
      render(
          tripDaysItemView,
          pointsListView,
          AddedComponentPosition.BEFORE_END
      );

      this._dateContainers[index++] = tripDaysItemView;

      // точки маршрута даты сортируем по дате начала
      const tempPoints = mapDates.get(mapDateKey);
      // Цикл по всем точкам маршрута данной даты
      for (let j = 0; j < tempPoints.length; ++j) {
        this._renderPoint(tempPoints[j], pointsListView);
      }
    }
  }

  _renderNoPoints() {
    if (this._sortingView !== null) {
      remove(this._sortingView);
      this._sortingView = null;
    }

    remove(this._pointsPlanContainerView);

    // Метод для рендеринга заглушки
    render(
        this._tripPointsContainer,
        this._noPointsView,
        AddedComponentPosition.BEFORE_END
    );
  }

  renderPointsPlan(renderNewPointFlag) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints(this._filterModel.getFilter());
    if (points.length === 0) {
      if (renderNewPointFlag) {
        remove(this._noPointsView);
        this._newPointPresenter.initialize();
        return;
      }
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    if (renderNewPointFlag) {
      this._newPointPresenter.initialize();
    }

    render(
        this._tripPointsContainer,
        this._pointsPlanContainerView,
        AddedComponentPosition.BEFORE_END
    );
    this._renderPoints(this._planDatePointsMap);
  }
}
