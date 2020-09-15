import {FilterType} from "../const.js";

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
    const isEverythingDisabled = this.getPoints(FilterType.EVERYTHING).length === 0;
    const isFutureDisabled = this.getPoints(FilterType.FUTURE).length === 0;
    const isPastDisabled = this.getPoints(FilterType.PAST).length === 0;

    filterModel.setFilterDisabledFlags(
        isEverythingDisabled,
        isFutureDisabled,
        isPastDisabled
    );
  }
}
