import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._notify(filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
