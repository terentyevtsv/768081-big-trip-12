import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;

    this._isEverythingFilterDisabled = false;
    this._isFutureFilterDisabled = false;
    this._isPastFilterDisabled = false;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._notify(filter);
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilterDisabledFlags(
      isEverythingDisabled,
      isFutureDisabled,
      isPastDisabled
  ) {
    this._isEverythingFilterDisabled = isEverythingDisabled;
    this._isFutureFilterDisabled = isFutureDisabled;
    this._isPastFilterDisabled = isPastDisabled;
  }

  getFilterDisabledFlags() {
    return {
      isEverythingDisabled: this._isEverythingFilterDisabled,
      isFutureDisabled: this._isFutureFilterDisabled,
      isPastDisabled: this._isPastFilterDisabled
    };
  }
}
