import {FilterType, NO_POINTS_LENGTH} from "../const.js";

export default class PointsFiltration {
  constructor(points) {
    this._points = points;
    this._nowDate = new Date();
  }

  getPoints(filterType) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        return this._points;

      case FilterType.FUTURE:
        return this._points.filter((point) => point.timeInterval.leftLimitDate > this._nowDate);

      case FilterType.PAST:
        return this._points.filter((point) => point.timeInterval.rightLimitDate < this._nowDate);

      default:
        throw new Error(`Неизвестный тип фильтра!`);
    }
  }

  setFilterDisabledFlags(filterModel) {
    const isEverythingDisabled = this.getPoints(FilterType.EVERYTHING).length === NO_POINTS_LENGTH;
    const isFutureDisabled = this.getPoints(FilterType.FUTURE).length === NO_POINTS_LENGTH;
    const isPastDisabled = this.getPoints(FilterType.PAST).length === NO_POINTS_LENGTH;

    filterModel.setFilterDisabledFlags(
        isEverythingDisabled,
        isFutureDisabled,
        isPastDisabled
    );
  }
}
