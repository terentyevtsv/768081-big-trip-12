import {render, AddedComponentPosition, remove, replace} from "../utils/render.js";
import NoPointsNotificationView from "../view/no-points-notification.js";
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

const getTimeIntervalsDifference = (timeInterval) => {
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
    this._noPointsNotificationView = new NoPointsNotificationView();
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

  get datePointsPlan() {
    return this._datePointsPlan;
  }

  set currentSortType(sortType) {
    this._currentSortType = sortType;
  }

  createPoint() {
    this._filterModel.set(FilterType.EVERYTHING);
    this._currentSortType = SortType.EVENT;
    this._datePointsPlan = this._getDatePointsStructure();
    this.renderPointsPlan(true);
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

    this._datePointsPlan = this._getDatePointsStructure();
    if (this._siteMenuModel.getMenuItem() === MenuItem.TABLE) {
      this.renderPointsPlan(false);
    }
  }

  renderError(messageStructure) {
    const fullMessage = `Не загружены ${Object.values(messageStructure).join(` и `)}`;
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

    remove(this._noPointsNotificationView);
  }

  _getPoints(filterType) {
    const pointsFiltration = new PointsFiltration(this._pointsModel.get());
    return pointsFiltration.getPoints(filterType);
  }

  // Формирование структуры событий по датам
  _getDatePointsStructure() {
    const datePointsStructure = new Map();
    const points = this._getPoints(this._filterModel.get());

    if (this._currentSortType === SortType.EVENT) {
      // Обычный порядок
      const distinctDates = new Set();

      // Формируем список дат, по которым будут группироваться события
      points.forEach((point) => {
        const date = new Date(point.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        distinctDates.add(date.getTime());
      });

      // Сортируем даты в порядке возрастания
      const dates = Array.from(distinctDates)
        .sort((a, b) => a - b);

      // Раскидываем события по датам
      dates.forEach((date) => datePointsStructure.set(date, []));

      points.forEach((point) => {
        const date = new Date(point.timeInterval.leftLimitDate);
        date.setHours(0, 0, 0, 0);

        datePointsStructure.get(date.getTime()).push(point);
      });

      Array.from(datePointsStructure.keys()).forEach((dateKey) => datePointsStructure.get(dateKey)
        .sort((a, b) => a.timeInterval.leftLimitDate.getTime() -
                        b.timeInterval.leftLimitDate.getTime())
      );
      return datePointsStructure;
    }

    const tempDate = new Date();
    const copyPoints = points.slice();
    if (this._currentSortType === SortType.TIME) {
      // Порядок с сортировкой по времени точки маршрута
      copyPoints.sort((point1, point2) => getTimeIntervalsDifference(point2.timeInterval) -
                                  getTimeIntervalsDifference(point1.timeInterval));
      datePointsStructure.set(tempDate, copyPoints);

      return datePointsStructure;
    }

    // Порядок с сортировкой по цене
    copyPoints.sort((point1, point2) => point2.price - point1.price);
    datePointsStructure.set(tempDate, copyPoints);

    return datePointsStructure;
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

  _renderPoints(datePointsStructure) {
    Object.values(this._pointPresenter)
        .forEach((presenter) => presenter.destroy());
    this._dateContainers.forEach((d) => remove(d));

    this._pointPresenter = {};
    this._dateContainers = [];

    let index = 0;
    for (const dateKey of datePointsStructure.keys()) {
      // Какая-то дата путешествия
      const date = new Date(dateKey);

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
      const tempPoints = datePointsStructure.get(dateKey);
      // Цикл по всем точкам маршрута данной даты
      for (const tempPoint of tempPoints) {
        this._renderPoint(tempPoint, pointsListView);
      }
    }
  }

  _renderNoPointsNotification() {
    if (this._sortingView !== null) {
      remove(this._sortingView);
      this._sortingView = null;
    }

    remove(this._pointsPlanContainerView);

    // Метод для рендеринга заглушки
    render(
        this._tripPointsContainer,
        this._noPointsNotificationView,
        AddedComponentPosition.BEFORE_END
    );
  }

  renderPointsPlan(renderNewPointFlag) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints(this._filterModel.get());
    if (points.length === 0) {
      if (renderNewPointFlag) {
        remove(this._noPointsNotificationView);
        this._newPointPresenter.initialize();
        return;
      }
      this._renderNoPointsNotification();
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
    this._renderPoints(this._datePointsPlan);
  }

  _handleModelChange() {
    this._datePointsPlan = this._getDatePointsStructure();
    this.renderPointsPlan(false);
  }

  _handleFilterChanged() {
    remove(this._noPointsNotificationView);
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }

    this._currentSortType = SortType.EVENT;
    this.initialize(false);
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
      case UserAction.POINT_UPDATE:
        this._pointsModel.update(update);
        break;
      case UserAction.POINT_CREATION:
        this._pointsModel.add(update);
        break;
      case UserAction.POINT_REMOVAL:
        this._pointsModel.delete(update);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    const datePointsStructure = this._getDatePointsStructure();
    this._renderPoints(datePointsStructure);
  }
}
