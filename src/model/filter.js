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

  set(filter, notifyFlag) {
    this._activeFilter = filter;
    if (notifyFlag) {
      this._notify(filter);
    }
  }

  get() {
    return this._activeFilter;
  }

  setDisabledFlags(
      isEverythingDisabled,
      isFutureDisabled,
      isPastDisabled
  ) {
    this._isEverythingFilterDisabled = isEverythingDisabled;
    this._isFutureFilterDisabled = isFutureDisabled;
    this._isPastFilterDisabled = isPastDisabled;
  }

  getDisabledFlags() {
    return {
      isEverythingDisabled: this._isEverythingFilterDisabled,
      isFutureDisabled: this._isFutureFilterDisabled,
      isPastDisabled: this._isPastFilterDisabled
    };
  }
}
