import {FilterType} from "../const.js";
import AbstractView from "./abstract.js";

const createSiteFilterTemplate = (
    isEverythingDisabled,
    isFutureDisabled,
    isPastDisabled,
    filterType
) =>
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input
        id="filter-everything"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
        ${filterType === FilterType.EVERYTHING ? `checked` : ``}
        ${isEverythingDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-future"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="future"
        ${filterType === FilterType.FUTURE ? `checked` : ``}
        ${isFutureDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-past"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="past"
        ${filterType === FilterType.PAST ? `checked` : ``}
        ${isPastDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class Filter extends AbstractView {
  constructor(isEverythingDisabled, isFutureDisabled, isPastDisabled, filterType) {
    super();

    this._isEverythingDisabled = isEverythingDisabled;
    this._isFutureDisabled = isFutureDisabled;
    this._isPastDisabled = isPastDisabled;
    this._filterType = filterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(
        this._isEverythingDisabled,
        this._isFutureDisabled,
        this._isPastDisabled,
        this._filterType
    );
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
